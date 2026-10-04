import torch

from models.stage1_model import Stage1SkinClassifier
from models.stage2_model import Stage2LesionClassifier
from models.stage2_benign_malignant import BenignMalignantClassifier


class ModelManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)

            cls._instance.stage1_model = None
            cls._instance.benign_malignant_model = None
            cls._instance.lesion_model = None
            cls._instance.device = None

        return cls._instance

    def load_models(self):
        """Load all three models: Stage 1, Benign/Malignant, and Lesion classification."""

        print("Loading models...")

        # Detect device
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Using device: {self.device}")

        # -----------------------------
        # Load Stage 1 model (Skin vs Non-Skin)
        # -----------------------------
        print("Loading Stage 1 model (Skin vs Non-Skin)...")

        self.stage1_model = Stage1SkinClassifier()
        self.stage1_model.load_model()

        # -----------------------------
        # Load Benign/Malignant model
        # -----------------------------
        print("Loading Benign/Malignant model...")

        self.benign_malignant_model = BenignMalignantClassifier()
        self.benign_malignant_model.load_model()

        # -----------------------------
        # Load Lesion classification model (7-class)
        # -----------------------------
        print("Loading Lesion classification model (7-class)...")

        self.lesion_model = Stage2LesionClassifier()
        self.lesion_model.load_model()

        print("All models loaded successfully!")

    def is_loaded(self):
        """Check if models are loaded."""

        return (
            self.stage1_model is not None
            and self.benign_malignant_model is not None
            and self.lesion_model is not None
        )

    def get_stage1_model(self):
        """Get Stage 1 model instance."""

        if self.stage1_model is None:
            raise RuntimeError("Stage 1 model not loaded")

        return self.stage1_model

    def get_benign_malignant_model(self):
        """Get Benign/Malignant model instance."""

        if self.benign_malignant_model is None:
            raise RuntimeError("Benign/Malignant model not loaded")

        return self.benign_malignant_model

    def get_lesion_model(self):
        """Get Lesion classification model instance."""

        if self.lesion_model is None:
            raise RuntimeError("Lesion classification model not loaded")

        return self.lesion_model


# Global instance
model_manager = ModelManager()