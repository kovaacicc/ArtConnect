from django.contrib import admin
from .models import SearchCriterion, SystemSetting

admin.site.register(SearchCriterion)
admin.site.register(SystemSetting)