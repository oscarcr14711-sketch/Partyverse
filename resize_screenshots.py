from PIL import Image
import os

# Input and output folders
input_folder = 'screenshots'
output_folder = 'screenshots'

# Target size
target_size = (1248, 2778)

# Resize all screenshots
for i in range(1, 11):
    input_file = os.path.join(input_folder, f'screenshot1 ({i}).jpeg')
    output_file = os.path.join(output_folder, f'resized_screenshot_{i}.png')
    
    try:
        # Open image
        img = Image.open(input_file)
        
        # Resize to exact dimensions (will stretch if aspect ratio doesn't match)
        img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
        
        # Save as PNG with high quality
        img_resized.save(output_file, 'PNG', optimize=True)
        
        print(f'✓ Resized screenshot {i} -> {output_file}')
    except Exception as e:
        print(f'✗ Error resizing screenshot {i}: {e}')

print('\nAll done! Resized screenshots are ready for App Store.')
