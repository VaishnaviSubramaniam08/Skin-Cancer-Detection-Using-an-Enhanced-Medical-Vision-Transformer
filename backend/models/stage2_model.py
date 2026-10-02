import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from typing import Dict, Tuple
import os


class Stage2LesionClassifier:

    def __init__(self, checkpoint_path: str = None):

        self.checkpoint_path = (
            checkpoint_path
            or "models/best_vit_isic2019_sqrt_weights.pth"
        )

        self.model = None
        self.device = None
        self.class_names = None
        self.num_classes = None

        # ISIC 2019 classes
        self.default_class_names = [
            "MEL",
            "NV",
            "BCC",
            "AK",
            "BKL",
            "DF",
            "VASC",
            "SCC"
        ]

        # ImageNet normalization
        self.normalize = transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            self.normalize
        ])

    # ==========================================================
    # LOAD MODEL
    # ==========================================================

    def load_model(self):

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Stage 2 device: {self.device}")

        # ------------------------------------------------------
        # Create ViT-B/16
        # ------------------------------------------------------

        self.model = models.vit_b_16(weights=None)

        # ------------------------------------------------------
        # Check checkpoint
        # ------------------------------------------------------

        if not os.path.exists(self.checkpoint_path):

            print(
                f"WARNING: Checkpoint not found: "
                f"{self.checkpoint_path}"
            )

            self.num_classes = 8
            self.class_names = self.default_class_names

            in_features = self.model.heads.head.in_features

            self.model.heads.head = nn.Sequential(
                nn.Dropout(p=0.3),
                nn.Linear(
                    in_features,
                    self.num_classes
                )
            )

        else:

            print(
                f"Loading checkpoint: "
                f"{self.checkpoint_path}"
            )

            checkpoint = torch.load(
                self.checkpoint_path,
                map_location=self.device
            )

            # --------------------------------------------------
            # Get state dict
            # --------------------------------------------------

            if "model_state_dict" in checkpoint:

                state_dict = checkpoint["model_state_dict"]

            elif "state_dict" in checkpoint:

                state_dict = checkpoint["state_dict"]

            else:

                state_dict = checkpoint

            # --------------------------------------------------
            # Determine number of classes
            # --------------------------------------------------

            if "class_names" in checkpoint:

                self.class_names = checkpoint["class_names"]
                self.num_classes = len(self.class_names)

            elif "classes" in checkpoint:

                self.class_names = checkpoint["classes"]
                self.num_classes = len(self.class_names)

            else:

                self.num_classes = None

                # Look for classifier weight
                for key, value in state_dict.items():

                    if (
                        "heads.head" in key
                        and key.endswith(".weight")
                    ):

                        self.num_classes = value.shape[0]

                        print(
                            f"Detected classifier layer: {key}"
                        )

                        break

                if self.num_classes is None:

                    self.num_classes = 8

                if self.num_classes == 8:

                    self.class_names = (
                        self.default_class_names
                    )

                else:

                    self.class_names = [
                        f"Class_{i}"
                        for i in range(self.num_classes)
                    ]

            # --------------------------------------------------
            # Create EXACT classifier architecture
            # --------------------------------------------------

            in_features = self.model.heads.head.in_features

            self.model.heads.head = nn.Sequential(

                nn.Dropout(p=0.3),

                nn.Linear(
                    in_features,
                    self.num_classes
                )
            )

            # --------------------------------------------------
            # Load trained weights
            # --------------------------------------------------

            self.model.load_state_dict(
                state_dict,
                strict=True
            )

            print(
                "Stage 2 model loaded successfully!"
            )

            print(
                f"Number of classes: "
                f"{self.num_classes}"
            )

            print(
                f"Class names: "
                f"{self.class_names}"
            )

        # ------------------------------------------------------
        # Move model to device
        # ------------------------------------------------------

        self.model.to(self.device)

        self.model.eval()

        return self.model

    # ==========================================================
    # PREPROCESS IMAGE
    # ==========================================================

    def preprocess_image(
        self,
        image: Image.Image
    ) -> torch.Tensor:

        if image.mode != "RGB":

            image = image.convert("RGB")

        tensor = self.transform(image)

        tensor = tensor.unsqueeze(0)

        return tensor.to(self.device)

    # ==========================================================
    # PREDICT
    # ==========================================================

    def predict(
        self,
        image: Image.Image
    ) -> Tuple[str, float]:

        if self.model is None:

            raise RuntimeError(
                "Model not loaded. "
                "Call load_model() first."
            )

        tensor = self.preprocess_image(image)

        with torch.no_grad():

            outputs = self.model(tensor)

            probabilities = torch.softmax(
                outputs,
                dim=1
            )

            confidence, predicted = torch.max(
                probabilities,
                1
            )

        predicted_class = self.class_names[
            predicted.item()
        ]

        confidence_score = confidence.item()

        return (
            predicted_class,
            confidence_score
        )

    # ==========================================================
    # GET PROBABILITIES
    # ==========================================================

    def get_probabilities(
        self,
        image: Image.Image
    ) -> Dict[str, float]:

        if self.model is None:

            raise RuntimeError(
                "Model not loaded. "
                "Call load_model() first."
            )

        tensor = self.preprocess_image(image)

        with torch.no_grad():

            outputs = self.model(tensor)

            probabilities = torch.softmax(
                outputs,
                dim=1
            )

            probabilities = (
                probabilities
                .cpu()
                .numpy()[0]
            )

        return {
            self.class_names[i]: float(
                probabilities[i]
            )
            for i in range(len(self.class_names))
        }