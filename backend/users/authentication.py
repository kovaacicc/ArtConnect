from rest_framework.authentication import SessionAuthentication

# DRF = Django REST framework, runna SessionAuthentication401 klasu za svaki API request
# što radi klasa i podklasa:
    # 1. SessionAuthentication: It reads the sessionid cookie, finds the logged-in user and puts it in request.user. It also checks CSRF on POST requests from logged-in users.
    # 2. SessionAuthentication401: When nobody is logged in, it makes DRF return 401 instead of 403.

# Poziva se zbog  REST_FRAMEWORK = {
    #"DEFAULT_AUTHENTICATION_CLASSES": ["users.authentication.SessionAuthentication401"],
    #"DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
#}  u settings.pyu

class SessionAuthentication401(SessionAuthentication):
    """
    Same as DRF's SessionAuthentication, but an unauthenticated request gets
    401 instead of 403, so the frontend can tell "not logged in" apart from
    "forbidden".
    """

    # overridanje ove funkcije koju SessionAuthentication ne postavlja, omogućava se 403->401
    def authenticate_header(self, request):
        return "Session"