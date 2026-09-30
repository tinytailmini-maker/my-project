# 일본어 여성 내레이션(Mei) 생성 — pip install pyopenjtalk numpy
import sys, wave, numpy as np, pyopenjtalk
text = sys.argv[1] if len(sys.argv)>1 else "この秋の主役。バーバリー、ヴィンテージチェックのクロスボディ。"
out  = sys.argv[2] if len(sys.argv)>2 else "narration.wav"
x, sr = pyopenjtalk.tts(text, speed=0.9, half_tone=-3.0)  # 고급 톤(피치↓·속도↓) 여성 음성
x = np.clip(x, -32768, 32767).astype(np.int16)
with wave.open(out,"wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
print("OK", round(len(x)/sr,2), "sec ->", out)
