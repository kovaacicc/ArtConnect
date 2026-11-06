from allauth.socialaccount.adapter import DefaultSocialAccountAdapter



# na prvi sign in sa Googlom se popunjavaju ove stvari
class SocialAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        user.display_name = data.get("name") or data.get("email", "")
        user.oauth_provider = sociallogin.account.provider
        user.oauth_subject = sociallogin.account.uid
        return user