import requests

url = "<http://localhost:8000/enterprise>"
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
