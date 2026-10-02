import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import matplotlib.pyplot as plt
import os
import uuid
from typing import Optional


class ViTGradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hook_handles = []
        
        # Register hooks
        self._register_hooks()
    
    def _register_hooks(self):
        """Register forward and backward hooks."""
        def forward_hook(module, input, output):
            self.activations = output
        
        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0]
        
        # Find the target layer
        for name, module in self.model.named_modules():
            if name == self.target_layer:
                self.hook_handles.append(module.register_forward_hook(forward_hook))
                self.hook_handles.append(module.register_backward_hook(backward_hook))
                break
    
    def remove_hooks(self):
        """Remove registered hooks."""
        for handle in self.hook_handles:
            handle.remove()
        self.hook_handles = []
    
    def generate_cam(self, input_tensor, target_class=None):
        """Generate Grad-CAM heatmap ViT-compatible."""
        self.model.eval()
        
        # Forward pass
        output = self.model(input_tensor)
        
        if target_class is None:
            target_class = output.argmax(dim=1).item()
        
        # Zero gradients
        self.model.zero_grad()
        
        # Backward pass
        target = output[0, target_class]
        target.backward()
        
        # Get gradients and activations
        gradients = self.gradients
        activations = self.activations
        
        if gradients is None or activations is None:
            # Fallback: use attention weights
            return self._generate_attention_heatmap(input_tensor)
        
        # Global average pooling of gradients
        weights = gradients.mean(dim=(2, 3), keepdim=True)
        
        # Weighted combination of activations
        cam = (weights * activations).sum(dim=1, keepdim=True)
        
        # ReLU
        cam = F.relu(cam)
        
        # Resize to input size
        cam = F.interpolate(cam, size=(224, 224), mode='bilinear', align_corners=False)
        
        # Normalize
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        
        return cam
    
    def _generate_attention_heatmap(self, input_tensor):
        """Generate heatmap using attention weights as fallback."""
        # This is a simplified attention-based visualization
        # For a full implementation, you would extract attention weights from ViT
        
        # Create a simple gradient-based visualization
        input_tensor.requires_grad = True
        output = self.model(input_tensor)
        target_class = output.argmax(dim=1).item()
        
        self.model.zero_grad()
        output[0, target_class].backward()
        
        # Get input gradients
        gradients = input_tensor.grad.squeeze().cpu().numpy()
        
        # Compute magnitude
        gradients = np.abs(gradients)
        gradients = gradients.mean(axis=0)
        
        # Normalize
        gradients = (gradients - gradients.min()) / (gradients.max() - gradients.min() + 1e-8)
        
        return gradients


def apply_colormap(heatmap: np.ndarray) -> np.ndarray:
    """Apply red colormap to heatmap."""
    # Create red colormap
    heatmap_uint8 = (heatmap * 255).astype(np.uint8)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_HOT)
    
    # Extract red channel and enhance
    heatmap_color = heatmap_color[:, :, 2]  # Red channel
    
    # Create RGB image with red intensity
    heatmap_rgb = np.zeros((224, 224, 3), dtype=np.uint8)
    heatmap_rgb[:, :, 0] = heatmap_color  # Red channel
    heatmap_rgb[:, :, 1] = (heatmap_color * 0.2).astype(np.uint8)  # Green (low)
    heatmap_rgb[:, :, 2] = (heatmap_color * 0.2).astype(np.uint8)  # Blue (low)
    
    return heatmap_rgb


def overlay_heatmap(image: Image.Image, heatmap: np.ndarray, alpha: float = 0.4) -> Image.Image:
    """Overlay heatmap on original image."""
    # Resize image to match heatmap
    image_resized = image.resize((224, 224))
    image_np = np.array(image_resized)
    
    # Apply colormap
    heatmap_color = apply_colormap(heatmap)
    
    # Blend
    overlay = cv2.addWeighted(image_np, 1 - alpha, heatmap_color, alpha, 0)
    
    return Image.fromarray(overlay)


def save_gradcam_images(
    original_image: Image.Image,
    heatmap: np.ndarray,
    output_dir: str = "gradcam_results"
) -> dict:
    """Save Grad-CAM visualization images."""
    os.makedirs(output_dir, exist_ok=True)
    
    unique_id = str(uuid.uuid4())
    
    # Save original image
    original_path = os.path.join(output_dir, f"{unique_id}_original.jpg")
    original_image.save(original_path)
    
    # Save heatmap
    heatmap_color = apply_colormap(heatmap)
    heatmap_path = os.path.join(output_dir, f"{unique_id}_heatmap.jpg")
    Image.fromarray(heatmap_color).save(heatmap_path)
    
    # Save overlay
    overlay = overlay_heatmap(original_image, heatmap)
    overlay_path = os.path.join(output_dir, f"{unique_id}_overlay.jpg")
    overlay.save(overlay_path)
    
    return {
        "original": f"/gradcam_results/{unique_id}_original.jpg",
        "heatmap": f"/gradcam_results/{unique_id}_heatmap.jpg",
        "overlay": f"/gradcam_results/{unique_id}_overlay.jpg"
    }


def generate_stage1_explanation(model, image: Image.Image, predicted_class: str) -> dict:
    """Generate Grad-CAM explanation for Stage 1 model."""
    from torchvision import transforms
    import torch
    
    # Preprocess image
    normalize = transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        normalize
    ])
    
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    input_tensor = transform(image).unsqueeze(0)
    device = next(model.parameters()).device
    input_tensor = input_tensor.to(device)
    
    # Create Grad-CAM
    gradcam = ViTGradCAM(model, "encoder.layers.encoder_layer_11.ln1")
    
    try:
        # Generate heatmap
        heatmap = gradcam.generate_cam(input_tensor)
        
        # Save images
        result_paths = save_gradcam_images(image, heatmap)
        
        gradcam.remove_hooks()
        
        return {
            "available": True,
            "gradcam_url": result_paths["overlay"],
            "heatmap_url": result_paths["heatmap"],
            "original_url": result_paths["original"]
        }
    except Exception as e:
        gradcam.remove_hooks()
        print(f"Error generating Stage 1 Grad-CAM: {e}")
        return {"available": False}


def generate_stage2_explanation(model, image: Image.Image, predicted_class: str) -> dict:
    """Generate Grad-CAM explanation for Stage 2 model."""
    from torchvision import transforms
    import torch
    
    # Preprocess image
    normalize = transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        normalize
    ])
    
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    input_tensor = transform(image).unsqueeze(0)
    device = next(model.parameters()).device
    input_tensor = input_tensor.to(device)
    
    # Create Grad-CAM
    gradcam = ViTGradCAM(model, "encoder.layers.encoder_layer_11.ln1")
    
    try:
        # Generate heatmap
        heatmap = gradcam.generate_cam(input_tensor)
        
        # Save images
        result_paths = save_gradcam_images(image, heatmap)
        
        gradcam.remove_hooks()
        
        return {
            "available": True,
            "gradcam_url": result_paths["overlay"],
            "heatmap_url": result_paths["heatmap"],
            "original_url": result_paths["original"]
        }
    except Exception as e:
        gradcam.remove_hooks()
        print(f"Error generating Stage 2 Grad-CAM: {e}")
        return {"available": False}
