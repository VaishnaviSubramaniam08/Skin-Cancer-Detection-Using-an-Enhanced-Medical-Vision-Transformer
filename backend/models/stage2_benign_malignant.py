from PIL import Image
import torch
from transformers import ViTForImageClassification, ViTImageProcessor
import os


class BenignMalignantClassifier:
    """
    Benign vs Malignant skin lesion classifier using ViT.
    """

    def __init__(self, model_dir: str = None):
        # Use absolute path to models directory
        if model_dir is None:
            self.model_dir = os.path.dirname(os.path.abspath(__file__))
        else:
            self.model_dir = model_dir
        self.model = None
        self.processor = None
        self.device = None
        self.class_names = ["Benign", "Malignant"]

    def load_model(self):
        """
        Load the Benign/Malignant ViT model from local files.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load model from local config and safetensors
        self.model = ViTForImageClassification.from_pretrained(
            self.model_dir,
            local_files_only=True,
            dtype=torch.float32
        )
        self.model.to(self.device)
        self.model.eval()
        
        # Load processor from local config
        self.processor = ViTImageProcessor.from_pretrained(
            self.model_dir,
            local_files_only=True
        )
        
        print(f"Benign/Malignant model loaded on device: {self.device}")

    def preprocess_image(self, image: Image.Image) -> torch.Tensor:
        """
        Preprocess image for the model.
        """
        if self.processor is None:
            raise RuntimeError("Processor not loaded. Call load_model() first.")
        
        inputs = self.processor(images=image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        return inputs

    def predict(self, image: Image.Image) -> tuple[str, float]:
        """
        Predict the class and confidence for the image.
        """
        if self.model is None or self.processor is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        inputs = self.preprocess_image(image)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        predicted_class = self.class_names[predicted.item()]
        confidence_score = confidence.item()
        
        return predicted_class, confidence_score

    def get_probabilities(self, image: Image.Image) -> dict:
        """
        Get probability distribution for all classes.
        """
        if self.model is None or self.processor is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        inputs = self.preprocess_image(image)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
        
        probs = probabilities[0].cpu().tolist()
        return {class_name: prob for class_name, prob in zip(self.class_names, probs)}
