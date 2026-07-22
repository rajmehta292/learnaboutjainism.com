import json
import os

os.makedirs("c:/Projects/learnaboutjainism.com/src/data", exist_ok=True)

purvas_data = {
    "title": "The Fourteen Purvas",
    "description": "The Fourteen Purvas (meaning ancient or prior knowledge) are a large body of Jain scriptures that was preached by all Tirthankaras (omniscient teachers) of Jainism encompassing the entire gamut of knowledge available in this universe. The persons having the knowledge of purvas were given an exalted status of Shrutakevali or 'scripturally omniscient persons'. Both the Jain traditions, Śvetāmbara and Digambara hold that all the fourteen purvas have been lost.",
    "list": [
        {"id": 1, "term": "Utpaad Pūrva", "desc": "Living (Jiv), non-living (Ajiv), and its modes (Paryāya)"},
        {"id": 2, "term": "Agrayaniya Purva", "desc": "Nine realities (Navtattva), six substances (Shad-dravya), etc."},
        {"id": 3, "term": "Viryapravada Purva", "desc": "Relating to energy of soul, non-living, etc."},
        {"id": 4, "term": "Asti Nasti Pravada Purva", "desc": "Multiplicity of views (Anekāntvād), Saptabhangi, etc."},
        {"id": 5, "term": "Jnana Prāvada Pūrva", "desc": "Five types of knowledge and three types of ignorance, etc."},
        {"id": 6, "term": "Satya Pravada Purva", "desc": "Relating to truth, restraint, silence (Maun), speech, etc."},
        {"id": 7, "term": "Atma pavada Purva", "desc": "Analysis of soul from different view points (naya)"},
        {"id": 8, "term": "Karma Pravada Pūrva", "desc": "Theory of karma, its bondage, influx, its nature, fruition, shedding"},
        {"id": 9, "term": "Pratyakhyana Purva", "desc": "Giving up (Pachchhakhān), restraint, vows, detachment, etc."},
        {"id": 10, "term": "Vidyā Pravāda Purva", "desc": "Expertise (vidyā), exceptional abilities, practice"},
        {"id": 11, "term": "Kalyana Pravada Purva", "desc": "Spiritual alertness (Apramād) and laziness (Pramād)"},
        {"id": 12, "term": "Prana Pravada Purva", "desc": "Ten types of life substances or vitalities (Prān), life span, etc."},
        {"id": 13, "term": "Kriyā Visala Purva", "desc": "Skills, 64 arts of women, 84 arts of men, etc."},
        {"id": 14, "term": "Lokbindusā Purva", "desc": "Three parts of universe including heavens and hells, mathematics, etc."}
    ],
    "srutakevalis": [
        "Ganadhara Gautam Swami",
        "Ganadhara Sudharma Swami",
        "Jambuswami",
        "Prabhava",
        "Sayyambhava",
        "Yashobhadra",
        "Sambhutavijaya",
        "Bhadrabahu",
        "Sthulabhadra"
    ]
}

with open("c:/Projects/learnaboutjainism.com/src/data/purvas.json", "w", encoding="utf-8") as f:
    json.dump([purvas_data], f, indent=2, ensure_ascii=False)

print("Successfully expanded purvas.json!")
