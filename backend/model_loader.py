import tensorflow as tf
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, "models", "braintumor.keras")

model = tf.keras.models.load_model(model_path)
# Labels (same order as training)
class_names = [
    "glioma", 
    "meningioma", 
    "notumor",
    "pituitary"
      ]


