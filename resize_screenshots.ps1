Add-Type -AssemblyName System.Drawing

$targetWidth = 1248
$targetHeight = 2778

for ($i = 1; $i -le 10; $i++) {
    $inputFile = "screenshots\screenshot1 ($i).jpeg"
    $outputFile = "screenshots\resized_screenshot_$i.png"
    
    try {
        $fullInputPath = Join-Path (Get-Location) $inputFile
        $fullOutputPath = Join-Path (Get-Location) $outputFile
        
        # Load the image
        $img = [System.Drawing.Image]::FromFile($fullInputPath)
        
        # Create new bitmap
        $resized = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($resized)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        # Draw resized image
        $graphics.DrawImage($img, 0, 0, $targetWidth, $targetHeight)
        
        # Save as PNG
        $resized.Save($fullOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Cleanup
        $graphics.Dispose()
        $resized.Dispose()
        $img.Dispose()
        
        Write-Host "Resized screenshot $i"
    }
    catch {
        Write-Host "Error resizing screenshot $i"
    }
}

Write-Host "Done! Check screenshots folder for resized files"
