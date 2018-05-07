import os
import requests
import json
from twilio.twiml.messaging_response import MessagingResponse
from twilio import twiml

def handle(req):
    
    # parse inbound payload
    msgBody = req.values.get('Body')
    toPhone = req.values.get('To')
    fromPhone = req.values.get('From')
    fromCity = req.values.get('FromCity')
    fromState = req.values.get('FromState')
    fromCountry = req.values.get('FromCountry')
    fromZip = req.values.get('FromZip')

    # set target subject based on toPhone
    if toPhone == "+14158683905":
        objectID = "5a4f97f0dbbb7e24bd9a15d1"
        language = "Python"
    elif toPhone == "+14158683603":
        objectID = "5a4f97f0dbbb7e24bd9a15d2"
        language = "C#"
    elif toPhone == "+14158683413":
        objectID = "5a4f97f0dbbb7e24bd9a15d4"
        language = "Javascript"
    elif toPhone == "+14158683787":
        objectID = "5a4f97f0dbbb7e24bd9a15d3"
        language = "Go"
    elif toPhone == "+14125679951":
        objectID = "5a4f97f0dbbb7e24bd9a15d3"
        language = "C++"

    siteCode = "PRG"

    # call cognitive services for sentiment analysis
    subscription_key = os.environ['COG_SERVICES_KEY']
    sentiment_api_url = os.environ['COG_SERVICES_URL']

    documents = {}
    documents['documents'] = [{'id': '1', 'language': 'en', 'text': msgBody }]

    headers   = {"Ocp-Apim-Subscription-Key": subscription_key}
    response  = requests.post(sentiment_api_url, headers=headers, json=documents)
    sentiments = response.json()
    
    for x in sentiments['documents']:
        baseScore = x['score']

    if baseScore >= 0.80:
        rating = 5
    elif baseScore >= 0.60 and baseScore < 0.80:
        rating = 4
    elif baseScore >= 0.40 and baseScore < 0.60:
        rating = 3
    elif baseScore >= 0.20 and baseScore < 0.40:
        rating = 2
    else:
        rating = 1

    # POST data to api_ratings
    ratingData = {}
    ratingData['siteCode'] = siteCode
    ratingData['subjectRated'] = objectID 
    ratingData['rating'] = str(rating)
    ratingData['metadata'] = { 'origMessage': msgBody, 'cogScore': str(baseScore), 'toPhone': toPhone, 'sourcePhone': fromPhone, 'city': fromCity, 'state': fromState, 'zip': fromZip, 'country': fromCountry }
    
    ratingapiTarget = os.environ['API_URL']
    response = requests.post(ratingapiTarget, json=ratingData)

    # create twilio response message
    resp = MessagingResponse()
    resp.message("Your vote for " + language + " was scored " + str(baseScore) + " with Azure Cognitive Services (sentiment). Rating=" + str(rating))

    return str(resp)