import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
from typing import Dict, Tuple
import os


class Stage1SkinClassifier:
    def __init__(self, checkpoint_path: str = None):
        self.checkpoint_path = checkpoint_path or "models/best_skin_nonskin_vit.pth"
        self.model = None
        self.device = None
        self.class_names = ["NON_SKIN", "SKIN"]
        
        # ImageNet normalization
        self.normalize = transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
        
        # Preprocessing transform
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            self.normalize
        ])
    
    def load_model(self):
        """Load the Stage 1 ViT-B/16 model from checkpoint."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load ViT-B/16 model
        self.model = models.vit_b_16(weights=None)
        
        # Modify the classifier for 2 classes (NON_SKIN, SKIN)
        in_features = self.model.heads.head.in_features
        self.model.heads.head = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(in_features, 2)
        )
        
        # Load checkpoint
        if os.path.exists(self.checkpoint_path):
            checkpoint = torch.load(self.checkpoint_path, map_location=self.device)
            
            # Handle different checkpoint formats
            if "model_state_dict" in checkpoint:
                self.model.load_state_dict(checkpoint["model_state_dict"])
            elif "state_dict" in checkpoint:
                self.model.load_state_dict(checkpoint["state_dict"])
            else:
                self.model.load_state_dict(checkpoint)
            
            print(f"Stage 1 model loaded from {self.checkpoint_path}")
        else:
            print(f"Warning: Checkpoint not found at {self.checkpoint_path}")
        
        self.model.to(self.device)
        self.model.eval()
        
        return self.model
    
    def preprocess_image(self, image: Image.Image) -> torch.Tensor:
        """Preprocess image for model input."""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        tensor = self.transform(image)
        tensor = tensor.unsqueeze(0)  # Add batch dimension
        return tensor.to(self.device)
    
    def predict(self, image: Image.Image) -> Tuple[str, float]:
        """Predict skin vs non-skin."""
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        tensor = self.preprocess_image(image)
        
        with torch.no_grad():
            outputs = self.model(tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        predicted_class = self.class_names[predicted.item()]
        confidence_score = confidence.item()
        
        return predicted_class, confidence_score
    
    def get_probabilities(self, image: Image.Image) -> Dict[str, float]:
        """Get probability distribution for both classes."""
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        tensor = self.preprocess_image(image)
        
        with torch.no_grad():
            outputs = self.model(tensor)
            probabilities = torch.softmax(outputs, dim=1)
            probabilities = probabilities.cpu().numpy()[0]
        
        return {
            self.class_names[i]: float(probabilities[i])
            for i in range(len(self.class_names))
        }
