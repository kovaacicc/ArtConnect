from rest_framework.authentication import SessionAuthentication


class SessionAuthentication401(SessionAuthentication):
    """
    Same as DRF's SessionAuthentication, but an unauthenticated request gets
    401 instead of 403, so the frontend can tell "not logged in" apart from
    "forbidden".
    """

    def authenticate_header(self, request):
        return "Session"