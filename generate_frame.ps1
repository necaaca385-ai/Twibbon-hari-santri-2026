Add-Type -AssemblyName System.Drawing

$width = 1080
$height = 1080
$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Colors
$cDarkGreen = [System.Drawing.Color]::FromArgb(255, 6, 78, 59)
$cForest = [System.Drawing.Color]::FromArgb(255, 4, 120, 87)
$cGold = [System.Drawing.Color]::FromArgb(255, 245, 158, 11)
$cLightGold = [System.Drawing.Color]::FromArgb(255, 253, 230, 138)
$cWhite = [System.Drawing.Color]::White

# 1. Fill entire frame with gradient
$rectFull = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$linBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectFull, $cDarkGreen, $cForest, 45.0)
$g.FillRectangle($linBrush, $rectFull)

# 2. Cutout transparent circle window for user photo in the center
# Circle: centered at (540, 520), radius 380 (width 760, height 760)
$cutRect = New-Object System.Drawing.Rectangle(160, 170, 760, 710)
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$clearBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Transparent)
$g.FillEllipse($clearBrush, $cutRect)

# 3. Restore CompositingMode to SourceOver
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver

# Borders around the photo window
$penGoldOuter = New-Object System.Drawing.Pen($cGold, 12)
$penGoldInner = New-Object System.Drawing.Pen($cLightGold, 4)
$g.DrawEllipse($penGoldOuter, 160, 170, 760, 710)
$g.DrawEllipse($penGoldInner, 172, 182, 736, 686)

# Canvas outer border
$penFrameOuter = New-Object System.Drawing.Pen($cGold, 10)
$penFrameInner = New-Object System.Drawing.Pen($cLightGold, 3)
$g.DrawRectangle($penFrameOuter, 20, 20, $width - 40, $height - 40)
$g.DrawRectangle($penFrameInner, 30, 30, $width - 60, $height - 60)

# String Format
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

# Brushes
$bGold = New-Object System.Drawing.SolidBrush($cGold)
$bLightGold = New-Object System.Drawing.SolidBrush($cLightGold)
$bWhite = New-Object System.Drawing.SolidBrush($cWhite)
$bDark = New-Object System.Drawing.SolidBrush($cDarkGreen)

# Header
$fHeaderSub = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Bold)
$fHeaderMain = New-Object System.Drawing.Font('Arial Black', 34, [System.Drawing.FontStyle]::Bold)
$fHeaderQuote = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Italic)

$g.DrawString('★ TAMAN PENDIDIKAN AL-QUR''AN ★', $fHeaderSub, $bGold, (New-Object System.Drawing.RectangleF(0, 42, $width, 36)), $sf)
$g.DrawString('TPQ GENERASI QUR''ANI', $fHeaderMain, $bWhite, (New-Object System.Drawing.RectangleF(0, 80, $width, 48)), $sf)
$g.DrawString('Menyiapkan Generasi Beriman, Shalih, dan Berakhlak Karimah', $fHeaderQuote, $bLightGold, (New-Object System.Drawing.RectangleF(0, 130, $width, 30)), $sf)

# Badge at bottom of circle
$ribbonRect = New-Object System.Drawing.Rectangle(190, 825, 700, 80)
$g.FillRectangle($bGold, $ribbonRect)
$penRibbon = New-Object System.Drawing.Pen($cWhite, 4)
$g.DrawRectangle($penRibbon, $ribbonRect)

$fBadge = New-Object System.Drawing.Font('Arial Black', 30, [System.Drawing.FontStyle]::Bold)
$g.DrawString('SANTRI BERPRESTASI', $fBadge, $bDark, (New-Object System.Drawing.RectangleF(190, 825, 700, 80)), $sf)

# Footer text
$fFooter = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Bold)
$fFooterSub = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Regular)

$g.DrawString('BANGGA MENJADI SANTRI TPQ', $fFooter, $bWhite, (New-Object System.Drawing.RectangleF(0, 925, $width, 38)), $sf)
$g.DrawString('Semangat Menuntut Ilmu • Mengaji Setiap Hari', $fFooterSub, $bLightGold, (New-Object System.Drawing.RectangleF(0, 968, $width, 28)), $sf)

# Clean up
$g.Dispose()
$bmp.Save('frame.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Success generating frame.png"
