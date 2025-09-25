from django.urls import path, re_path
from django.views.generic import TemplateView
from views import lucky_message, emojis, lucky_number, countdown_sse
urlpatterns = [
    path("api/lucky/", lucky_message),
    path("api/emojis/", emojis),
    path("api/lucky-number/", lucky_number),
    path("api/countdown-sse/", countdown_sse),
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),  # SPA 前端
]
