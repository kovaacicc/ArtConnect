from rest_framework.authentication import SessionAuthentication

# DRF = Django REST framework, runna SessionAuthentication401 klasu za svaki API request
# što radi klasa i podklasa:
    # 1. SessionAuthentication: Pročita sessionid cookie, nađe tko je ulogirani user i stavi ga u request.user. 
    #                           Također gleda CSRF na POST requestovima ulogiranih usera.
    # 2. SessionAuthentication401: Kad nitko nije ulogiran, a pristupa se stranicama gdje mogu ići samo ulogirani, vraća status 401 umjest 403.
                                

# Poziva se zbog `DEFAULT_AUTHENTICATION_CLASSES: ["users.authentication.SessionAuthentication401"]` u settings.pyu

class SessionAuthentication401(SessionAuthentication):

    # overrideanje ove funkcije koju SessionAuthentication ne postavlja, omogućava se 403->401
    def authenticate_header(self, request):
        return "Session"