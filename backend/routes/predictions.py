from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from bson import ObjectId
from datetime import datetime

from database.database import get_database
from database.models import PredictionResponse
from models.model_manager import model_manager
from utils.image_utils import (
    validate_image,
    save_uploaded_image,
    load_image
)
from explainability.gradcam import generate_stage2_explanation
from routes.auth import get_current_user_from_token


router = APIRouter()


# ============================================================
# HELPER FUNCTION
# ============================================================

def get_created_at(prediction):
    """
    Get created_at safely.

    New records:
        Use stored created_at.

    Old records:
        Use MongoDB ObjectId creation time.
    """

    created_at = prediction.get("created_at")

    if created_at is not None:
        return created_at

    # Old MongoDB documents may not contain created_at
    object_id = prediction.get("_id")

    if isinstance(object_id, ObjectId):
        return object_id.generation_time.replace(tzinfo=None)

    # Final fallback
    return datetime.utcnow()


# ============================================================
# CREATE PREDICTION
# ============================================================

@router.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict(
    file: UploadFile = File(...),
    current_user_id: str = Depends(
        get_current_user_from_token
    ),
    db=Depends(get_database)
):
    """
    Run the two-stage skin cancer prediction pipeline.

    Stage 1:
        SKIN vs NON-SKIN

    Stage 2:
        Skin lesion classification

    Grad-CAM:
        Generated only when Stage 2 is executed.
    """

    # --------------------------------------------------------
    # 1. Validate image
    # --------------------------------------------------------

    validate_image(file)

    # --------------------------------------------------------
    # 2. Save uploaded image
    # --------------------------------------------------------

    image_path = save_uploaded_image(file)

    # --------------------------------------------------------
    # 3. Load image
    # --------------------------------------------------------

    image = load_image(image_path)

    # --------------------------------------------------------
    # 4. Get models
    # --------------------------------------------------------

    stage1_model = model_manager.get_stage1_model()
    stage2_model = model_manager.get_stage2_model()

    # --------------------------------------------------------
    # 5. Stage 1 prediction
    # --------------------------------------------------------

    stage1_class, stage1_confidence = (
        stage1_model.predict(image)
    )

    stage1_probabilities = (
        stage1_model.get_probabilities(image)
    )

    # --------------------------------------------------------
    # 6. Initialize Stage 2 values
    # --------------------------------------------------------

    stage2_executed = False
    stage2_class = None
    stage2_confidence = None
    stage2_probabilities = None
    gradcam_path = None

    # --------------------------------------------------------
    # 7. Stage 2 prediction
    # --------------------------------------------------------

    if stage1_class == "SKIN":

        stage2_executed = True

        # Stage 2 classification
        stage2_class, stage2_confidence = (
            stage2_model.predict(image)
        )

        # Stage 2 probabilities
        stage2_probabilities = (
            stage2_model.get_probabilities(image)
        )

        # ----------------------------------------------------
        # Generate Grad-CAM
        # ----------------------------------------------------

        explanation = generate_stage2_explanation(
            stage2_model.model,
            image,
            stage2_class
        )

        if explanation.get("available"):
            gradcam_path = explanation.get(
                "gradcam_url"
            )

    # --------------------------------------------------------
    # 8. Create database record
    # --------------------------------------------------------

    prediction_dict = {
        "user_id": current_user_id,

        "image_path": image_path,

        # Stage 1
        "stage1_class": stage1_class,
        "stage1_confidence": stage1_confidence,
        "stage1_probabilities": stage1_probabilities,

        # Stage 2
        "stage2_executed": stage2_executed,
        "stage2_class": stage2_class,
        "stage2_confidence": stage2_confidence,
        "stage2_probabilities": stage2_probabilities,

        # Grad-CAM
        "gradcam_path": gradcam_path,

        # Creation time
        "created_at": datetime.utcnow()
    }

    # --------------------------------------------------------
    # 9. Save prediction
    # --------------------------------------------------------

    result = await db.predictions.insert_one(
        prediction_dict
    )

    # --------------------------------------------------------
    # 10. Get created prediction
    # --------------------------------------------------------

    created_prediction = await db.predictions.find_one({
        "_id": result.inserted_id
    })

    if not created_prediction:
        raise HTTPException(
            status_code=500,
            detail="Prediction could not be saved"
        )

    # --------------------------------------------------------
    # 11. Return prediction
    # --------------------------------------------------------

    return PredictionResponse(
        id=str(created_prediction["_id"]),

        user_id=created_prediction["user_id"],

        image_path=(
            f"/uploads/"
            f"{created_prediction['image_path'].split('/')[-1]}"
        ),

        stage1_class=created_prediction.get(
            "stage1_class"
        ),

        stage1_confidence=created_prediction.get(
            "stage1_confidence"
        ),

        stage1_probabilities=created_prediction.get(
            "stage1_probabilities"
        ),

        stage2_executed=created_prediction.get(
            "stage2_executed",
            False
        ),

        stage2_class=created_prediction.get(
            "stage2_class"
        ),

        stage2_confidence=created_prediction.get(
            "stage2_confidence"
        ),

        stage2_probabilities=created_prediction.get(
            "stage2_probabilities"
        ),

        gradcam_path=created_prediction.get(
            "gradcam_path"
        ),

        created_at=get_created_at(
            created_prediction
        )
    )


# ============================================================
# GET ALL PREDICTIONS
# ============================================================

@router.get(
    "",
    response_model=list[PredictionResponse]
)
async def get_predictions(
    current_user_id: str = Depends(
        get_current_user_from_token
    ),
    db=Depends(get_database)
):
    """
    Get all predictions for the current user.
    """

    cursor = (
        db.predictions
        .find({
            "user_id": current_user_id
        })
        .sort(
            "_id",
            -1
        )
    )

    predictions = await cursor.to_list(
        length=100
    )

    result = []

    for p in predictions:

        # ----------------------------------------------------
        # Get created_at safely
        # ----------------------------------------------------

        created_at = get_created_at(p)

        # ----------------------------------------------------
        # Get image path safely
        # ----------------------------------------------------

        image_path = p.get("image_path")

        if image_path:
            image_url = (
                f"/uploads/"
                f"{image_path.split('/')[-1]}"
            )
        else:
            image_url = None

        # ----------------------------------------------------
        # Create response
        # ----------------------------------------------------

        result.append(
            PredictionResponse(
                id=str(p["_id"]),

                user_id=p["user_id"],

                image_path=image_url,

                # Stage 1
                stage1_class=p.get(
                    "stage1_class"
                ),

                stage1_confidence=p.get(
                    "stage1_confidence"
                ),

                stage1_probabilities=p.get(
                    "stage1_probabilities"
                ),

                # Stage 2
                stage2_executed=p.get(
                    "stage2_executed",
                    False
                ),

                stage2_class=p.get(
                    "stage2_class"
                ),

                stage2_confidence=p.get(
                    "stage2_confidence"
                ),

                stage2_probabilities=p.get(
                    "stage2_probabilities"
                ),

                # Grad-CAM
                gradcam_path=p.get(
                    "gradcam_path"
                ),

                # Timestamp
                created_at=created_at
            )
        )

    return result


# ============================================================
# GET SINGLE PREDICTION
# ============================================================

@router.get(
    "/{prediction_id}",
    response_model=PredictionResponse
)
async def get_prediction(
    prediction_id: str,

    current_user_id: str = Depends(
        get_current_user_from_token
    ),

    db=Depends(get_database)
):
    """
    Get one prediction by ID.
    """

    # --------------------------------------------------------
    # 1. Validate ObjectId
    # --------------------------------------------------------

    try:
        prediction_object_id = ObjectId(
            prediction_id
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid prediction ID"
        )

    # --------------------------------------------------------
    # 2. Find prediction
    # --------------------------------------------------------

    prediction = await db.predictions.find_one({
        "_id": prediction_object_id
    })

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    # --------------------------------------------------------
    # 3. Check ownership
    # --------------------------------------------------------

    if prediction.get("user_id") != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # --------------------------------------------------------
    # 4. Get created_at safely
    # --------------------------------------------------------

    created_at = get_created_at(
        prediction
    )

    # --------------------------------------------------------
    # 5. Get image path
    # --------------------------------------------------------

    image_path = prediction.get(
        "image_path"
    )

    if image_path:
        image_url = (
            f"/uploads/"
            f"{image_path.split('/')[-1]}"
        )
    else:
        image_url = None

    # --------------------------------------------------------
    # 6. Return prediction
    # --------------------------------------------------------

    return PredictionResponse(
        id=str(prediction["_id"]),

        user_id=prediction["user_id"],

        image_path=image_url,

        # Stage 1
        stage1_class=prediction.get(
            "stage1_class"
        ),

        stage1_confidence=prediction.get(
            "stage1_confidence"
        ),

        stage1_probabilities=prediction.get(
            "stage1_probabilities"
        ),

        # Stage 2
        stage2_executed=prediction.get(
            "stage2_executed",
            False
        ),

        stage2_class=prediction.get(
            "stage2_class"
        ),

        stage2_confidence=prediction.get(
            "stage2_confidence"
        ),

        stage2_probabilities=prediction.get(
            "stage2_probabilities"
        ),

        # Grad-CAM
        gradcam_path=prediction.get(
            "gradcam_path"
        ),

        # Timestamp
        created_at=created_at
    )


# ============================================================
# DELETE PREDICTION
# ============================================================

@router.delete(
    "/{prediction_id}"
)
async def delete_prediction(
    prediction_id: str,

    current_user_id: str = Depends(
        get_current_user_from_token
    ),

    db=Depends(get_database)
):
    """
    Delete a prediction belonging to the
    current user.
    """

    # --------------------------------------------------------
    # 1. Validate ObjectId
    # --------------------------------------------------------

    try:
        prediction_object_id = ObjectId(
            prediction_id
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid prediction ID"
        )

    # --------------------------------------------------------
    # 2. Find prediction
    # --------------------------------------------------------

    prediction = await db.predictions.find_one({
        "_id": prediction_object_id
    })

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    # --------------------------------------------------------
    # 3. Check ownership
    # --------------------------------------------------------

    if prediction.get("user_id") != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # --------------------------------------------------------
    # 4. Delete prediction
    # --------------------------------------------------------

    await db.predictions.delete_one({
        "_id": prediction_object_id
    })

    # --------------------------------------------------------
    # 5. Return success
    # --------------------------------------------------------

    return {
        "message": "Prediction deleted successfully"
    }