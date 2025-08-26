import requests

url = "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_RDXk6pmFk/enterprise"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer fake-token"
}
data = {
    "name": "Test Enterprise",
    "description": "Une entreprise de test"
}

response = requests.post(url, json=data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
