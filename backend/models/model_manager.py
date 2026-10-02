import torch

from models.stage1_model import Stage1SkinClassifier
from models.stage2_model import Stage2LesionClassifier


class ModelManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)

            cls._instance.stage1_model = None
            cls._instance.stage2_model = None
            cls._instance.device = None

        return cls._instance

    def load_models(self):
        """Load both Stage 1 and Stage 2 models."""

        print("Loading models...")

        # Detect device
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Using device: {self.device}")

        # -----------------------------
        # Load Stage 1 model
        # -----------------------------
        print("Loading Stage 1 model...")

        self.stage1_model = Stage1SkinClassifier()
        self.stage1_model.load_model()

        # -----------------------------
        # Load Stage 2 model
        # -----------------------------
        print("Loading Stage 2 model...")

        self.stage2_model = Stage2LesionClassifier()
        self.stage2_model.load_model()

        print("All models loaded successfully!")

    def is_loaded(self):
        """Check if models are loaded."""

        return (
            self.stage1_model is not None
            and self.stage2_model is not None
        )

    def get_stage1_model(self):
        """Get Stage 1 model instance."""

        if self.stage1_model is None:
            raise RuntimeError("Stage 1 model not loaded")

        return self.stage1_model

    def get_stage2_model(self):
        """Get Stage 2 model instance."""

        if self.stage2_model is None:
            raise RuntimeError("Stage 2 model not loaded")

        return self.stage2_model


# Global instance
model_manager = ModelManager()