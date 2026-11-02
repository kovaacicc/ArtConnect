from django.db import models

class SystemSetting(models.Model):
    setting_key = models.CharField(max_length=100, primary_key=True)
    value = models.TextField(blank=True)
 
    def __str__(self):
        return self.setting_key

class SearchCriterion(models.Model):
    criterion_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
 
    class Meta:
        verbose_name_plural = "search criteria"
 
    def __str__(self):
        return self.name
