from allauth.socialaccount.adapter import DefaultSocialAccountAdapter



# na prvi sign in sa Googlom, at the moment allauth creates a brand-new user from Google’s data (populate_user), se popunjavaju ove stvari
# allauth finds it through SOCIALACCOUNT_ADAPTER in settings.py
class SocialAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        user.display_name = data.get("name") or data.get("email", "")
        user.oauth_provider = sociallogin.account.provider
        user.oauth_subject = sociallogin.account.uid
        return user


# The order of events
# Login (browser): Google → allauth callback → SocialAdapter.populate_user → user row created → session cookie set.
# Any API call: SessionAuthentication401 identifies the user → the view runs → a serializer builds or validates the data.