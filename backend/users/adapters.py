from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


# Poredak događaja prilikom Logina
# Login (browser): Google → allauth callback → SocialAdapter.populate_user → user row kreiran → session cookie postavljen

# Adapter se poziva na prvi sign in sa Googlom, u trenutku kada allauth stvara brand-new usera na temelju Google date (sa populate_user()), 
# a on definira i popunjavanje nekih dodatnih stvari koje naš model user posjeduje, poput display_name ili oauth_provider
# allauth zna za adapter jer je naveden kao SOCIALACCOUNT_ADAPTER u settings.py

# izgled date, data = {'email': 'pero.peric@gmail.com', 'last_name': 'Perić', 'first_name': 'Petar'}

class SocialAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        full_name = f"{data.get('first_name') or ''} {data.get('last_name') or ''}".strip()
        user.display_name = full_name  or data.get("email", "")
        user.oauth_provider = sociallogin.account.provider
        user.oauth_subject = sociallogin.account.uid
        return user



