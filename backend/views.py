from django.http import StreamingHttpResponse, JsonResponse
from django.utils import timezone
import time
import random

# 歌詞陣列
LYRICS = [
    "歌詞由前端一次性 fetch(資料來源：後端）",
    "We wish you a Merry Christmas",
    "And a Happy New Year",
]

EMOJIS = ["🎄", "🎅", "🎁", "✨", "🌟", "🔔", "🎀", "🎉", "🎈"]

def lucky_message(request):
    """
    提供歌詞的 JSON 響應。
    """
    return JsonResponse({"lyrics": LYRICS})

def emojis(request):
    """
    提供帶有隨機屬性的表情符號列表。
    """
    emoji_with_props = [
        {
            "char": e,
            "left": random.uniform(0, 100),
            "size": random.uniform(20, 50),
            "duration": random.uniform(5, 10),
        }
        for e in EMOJIS
    ]
    return JsonResponse({"emojis": emoji_with_props})

def snowflakes(request):
    """
    隨機產生 10 片雪花的屬性（位置、大小、下落時間）。
    """
    snowflakes = [
        {
            "left": random.uniform(0, 100),
            "size": random.uniform(5, 15),
            "duration": random.uniform(5, 10),
        }
        for _ in range(10)  # 每次給 10 個雪花
    ]
    return JsonResponse({"snowflakes": snowflakes})

def lucky_number(request):
    """
    產生一個 1~100 的隨機數。
    """
    number = random.randint(1, 100)
    return JsonResponse({"number": number})
    
def countdown_sse(request):
    """
    這個視圖會以 Server-Sent Events (SSE) 的方式，
    向客戶端發送倒數計時的資料。
    """
    def event_stream():
        # 建立一個時區感知的目標時間（今年聖誕節）
        # 我們直接從一個時區感知的物件開始操作，避免任何類型衝突
        target = timezone.now().replace(
            month=12,
            day=25,
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        # 如果目前的日期已經超過聖誕節，則將目標時間設為下一年
        # 這裡的比較是安全的，因為兩者皆為時區感知
        if timezone.now() > target:
            target = target.replace(year=target.year + 1)
        
        while True:
            # 每次迴圈重新獲取當前時間，確保精確
            now_aware = timezone.now()
            
            # 進行安全的日期時間相減
            delta = target - now_aware
            seconds = max(int(delta.total_seconds()), 0)

            yield f"data: {{\"seconds\": {seconds}}}\n\n"
            
            # 如果時間到，發送結束訊息並退出
            if seconds == 0:
                break
            
            # --- 改善倒數計時精確度 ---
            # 計算距離下一個整秒所需暫停的時間
            sleep_time = 1 - now_aware.microsecond / 1_000_000.0
            
            # 如果剩餘時間太短（例如已經超過整秒），則直接設為一個小於1的值
            if sleep_time < 0.001:
                sleep_time = 0.001
            
            time.sleep(sleep_time)

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response
