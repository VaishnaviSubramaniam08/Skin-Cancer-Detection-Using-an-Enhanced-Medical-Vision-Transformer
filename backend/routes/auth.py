from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from bson import ObjectId

from database.database import get_database
from database.models import UserCreate, UserResponse

from utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# ============================================================
# GET CURRENT USER ID FROM TOKEN
# ============================================================

async def get_current_user_from_token(
    token: str = Depends(oauth2_scheme)
):
    """
    Extract and validate the user ID from JWT token.
    """

    payload = decode_token(token)

    # Token is invalid or expired
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Get user ID from token
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    return user_id


# ============================================================
# SIGNUP
# ============================================================

@router.post(
    "/signup",
    response_model=UserResponse
)
async def signup(
    user_data: UserCreate,
    db=Depends(get_database)
):
    """
    Register a new user.
    """

    # --------------------------------------------------------
    # 1. Check if email already exists
    # --------------------------------------------------------

    existing_user = await db.users.find_one({
        "email": user_data.email
    })

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # --------------------------------------------------------
    # 2. Convert user data to dictionary
    # --------------------------------------------------------

    user_dict = user_data.dict()

    # --------------------------------------------------------
    # 3. Get password and hash it
    # --------------------------------------------------------

    password = user_dict.pop("password")

    user_dict["password_hash"] = get_password_hash(
        password
    )

    # --------------------------------------------------------
    # 4. Add account creation time
    # --------------------------------------------------------

    user_dict["created_at"] = datetime.utcnow()

    # --------------------------------------------------------
    # 5. Insert user into MongoDB
    # --------------------------------------------------------

    new_user = await db.users.insert_one(
        user_dict
    )

    # --------------------------------------------------------
    # 6. Retrieve newly created user
    # --------------------------------------------------------

    created_user = await db.users.find_one({
        "_id": new_user.inserted_id
    })

    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User creation failed"
        )

    # --------------------------------------------------------
    # 7. Return user information
    # --------------------------------------------------------

    return UserResponse(
        id=str(created_user["_id"]),
        name=created_user["name"],
        email=created_user["email"],
        created_at=created_user["created_at"]
    )


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_database)
):
    """
    Login using email and password.
    
    OAuth2PasswordRequestForm uses:
        username -> email
        password -> password
    """

    # --------------------------------------------------------
    # 1. Find user using email
    # --------------------------------------------------------

    user = await db.users.find_one({
        "email": form_data.username
    })

    # --------------------------------------------------------
    # 2. Check user and password
    # --------------------------------------------------------

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Make sure password_hash exists
    if "password_hash" not in user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User password data is missing"
        )

    # Verify password
    if not verify_password(
        form_data.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # --------------------------------------------------------
    # 3. Create access token
    # --------------------------------------------------------

    access_token_expires = timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = create_access_token(
        data={
            "sub": str(user["_id"])
        },
        expires_delta=access_token_expires
    )

    # --------------------------------------------------------
    # 4. Return login response
    # --------------------------------------------------------

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }


# ============================================================
# GET CURRENT USER
# ============================================================

@router.get("/me")
async def get_current_user_info(
    current_user_id: str = Depends(
        get_current_user_from_token
    ),
    db=Depends(get_database)
):
    """
    Get information about the currently logged-in user.
    """

    # --------------------------------------------------------
    # 1. Validate MongoDB ObjectId
    # --------------------------------------------------------

    try:
        user_object_id = ObjectId(
            current_user_id
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID"
        )

    # --------------------------------------------------------
    # 2. Find user in MongoDB
    # --------------------------------------------------------

    user = await db.users.find_one({
        "_id": user_object_id
    })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # --------------------------------------------------------
    # 3. Get created_at safely
    # --------------------------------------------------------

    created_at = user.get(
        "created_at",
        None
    )

    # --------------------------------------------------------
    # 4. Return current user information
    # --------------------------------------------------------

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "created_at": created_at
    }