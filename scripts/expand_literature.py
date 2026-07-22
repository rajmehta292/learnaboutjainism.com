import json
import os

# Ensuring the directory exists
os.makedirs("c:/Projects/learnaboutjainism.com/src/data", exist_ok=True)

literature_base = [
    {
        "id": 1,
        "title": "Acharanga Sutra (Ayaramga)",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "The first and oldest of the 12 Angas, dealing with the monastic conduct and penances of Jain monks, specifically detailing the life of Lord Mahavira.",
        "details": "The Acharanga Sutra is the primary text regulating the life of Jain monks. The first part (Shrutaskandha) is considered the oldest part of the Jain canon, possibly dating back to the time of Mahavira himself or shortly after. It vividly describes Mahavira's ascetic wanderings, his endurance of hardships (upasargas), and his absolute commitment to Ahimsa (non-violence). The text meticulously details the rules for begging alms, walking, sitting, and sleeping to avoid harming even single-sensed organisms (ekindriya jivas).",
        "list": [
            {"name": "Bambha-chera (Brahmacharya) - Celibacy and self-restraint"},
            {"name": "Vimoha - Liberation from attachment"},
            {"name": "Uvahana - Bearing of hardships (Parishaha)"},
            {"name": "Mahaparinna - Great comprehension of non-violence"}
        ]
    },
    {
        "id": 2,
        "title": "Sutrakritanga (Suyagadamga)",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "The second Anga, focused on refuting heretical doctrines and establishing the Jain philosophical perspective.",
        "details": "This sutra acts as a philosophical treatise defending Jain metaphysics. It outlines various contemporary philosophical schools (such as Ajivika, Buddhist, and Carvaka/materialist) and methodically dismantles their arguments using Jain logic. It emphasizes the concept of Anekantavada (multi-sided reality) to demonstrate the partial truth of other systems while asserting the comprehensive truth of the Jain path. It also contains descriptions of hells to deter monks from breaking their vows."
    },
    {
        "id": 3,
        "title": "Sthananga Sutra (Thanamga)",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "An encyclopedic text organizing Jain concepts into numerical lists from one to ten.",
        "details": "Unlike narrative or purely philosophical sutras, the Sthananga Sutra is structured numerically. For instance, it lists one type of soul, two types of reality (Jiva and Ajiva), three jewels (Ratnatraya), four destinies (Gati), five vows (Mahavratas), and so on up to ten. This mnemonic structure made it easier for monks to memorize and transmit vast amounts of doctrinal, scientific, and ethical knowledge orally over centuries."
    },
    {
        "id": 4,
        "title": "Samavayanga Sutra",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "A continuation of the numerical listing system of the Sthananga Sutra, expanding beyond ten and adding cosmological details.",
        "details": "This text builds upon the Sthananga by detailing lists that exceed the number ten. It is crucial for understanding Jain cosmology, providing exact measurements of the universe, lifespans of celestial beings, and the dimensions of various hells and heavens. It also cross-references the other 11 Angas, acting as a sort of early index or summary of the entire canon."
    },
    {
        "id": 5,
        "title": "Bhagavati Sutra (Vyakhyaprajnapti)",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "The largest and most comprehensive Anga, structured as thousands of Q&A sessions between Lord Mahavira and his chief disciple Gautama Swami.",
        "details": "The Bhagavati Sutra is a monumental work in Jain literature. It contains approximately 36,000 questions posed by Indrabhuti Gautama and answered by Lord Mahavira. It covers an astonishing range of topics: karma theory, the nature of the soul, atomic theory (pudgala), biology, mathematics, cosmology, and the lives of other historical figures like Makkhali Gosala (founder of the Ajivikas). It is the most vital source for understanding the depth of Jain metaphysics."
    },
    {
        "id": 6,
        "title": "Jnata Dharma Kathanga (Nayadhammakahao)",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "A collection of allegorical stories and parables used by Lord Mahavira to illustrate profound spiritual truths.",
        "details": "This text uses the narrative format to explain complex doctrines. The most famous story is that of Princess Malli (the 19th Tirthankara in the Svetambara tradition), who used a golden statue filled with rotting food to teach her suitors about the foul nature of the physical body. These stories were heavily utilized by Jain monks during Chaturmas (monsoon retreat) to educate the lay community (shravakas) in an accessible and engaging manner."
    },
    {
        "id": 7,
        "title": "Upasakadasanga (Uvasagadasao)",
        "category": "Anga Agama",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "Chronicles the lives of ten eminent lay followers (Shravakas) of Lord Mahavira who strictly observed the Anuvratas.",
        "details": "While most Angas focus on monastic life, this text is dedicated to the householder's path. It details the biographies of ten wealthy merchants (like Ananda and Kamadeva) who embraced Jainism, took the twelve vows of a layperson, practiced severe austerities, and ultimately achieved favorable rebirths or liberation. It serves as the ultimate behavioral template for Jain laypeople."
    },
    {
        "id": 8,
        "title": "Tattvartha Sutra",
        "category": "Philosophical Treatise",
        "language": "Sanskrit",
        "author": "Acharya Umasvati",
        "desc": "The foundational Sanskrit text of Jainism, accepted by all traditions (Digambara and Svetambara). It systematically summarizes the entire Jain doctrine.",
        "details": "Written in the 2nd to 5th century CE, the Tattvartha Sutra translates to 'That Which Is'. It is often called the Jain Bible. In 10 chapters and over 350 aphorisms (sutras), Acharya Umasvati distills the vast canonical literature into a concise, logical framework. It begins with the famous sutra 'Samyag-darshana-jnana-charitrani mokshamargah' (Right faith, right knowledge, and right conduct constitute the path to liberation). It covers epistemology, cosmology, karma, and moksha.",
        "list": [
            {"name": "Chapter 1: Epistemology and the nature of knowledge"},
            {"name": "Chapter 2-4: The nature of the soul (Jiva) and cosmology"},
            {"name": "Chapter 5: Non-living substances (Ajiva)"},
            {"name": "Chapter 6-8: Influx and bondage of Karma (Asrava and Bandha)"},
            {"name": "Chapter 9: Stoppage and shedding of Karma (Samvara and Nirjara)"},
            {"name": "Chapter 10: Liberation (Moksha)"}
        ]
    },
    {
        "id": 9,
        "title": "Samayasara",
        "category": "Mystical Treatise",
        "language": "Prakrit",
        "author": "Acharya Kundakunda",
        "desc": "A profound mystical text focusing on the pure, absolute nature of the soul from the absolute point of view (Nishchaya Naya).",
        "details": "Revered especially in the Digambara tradition, the Samayasara (The Essence of the Soul) is Acharya Kundakunda's masterpiece. It rigorously separates the soul (Jiva) from karmic matter (Pudgala). It argues that from the absolute perspective, the soul is never bound by karma; it is always pure, omniscient, and blissful. The bondage is only from the practical point of view (Vyavahara Naya). This text shifts the focus from external rituals to intense inner realization and meditation."
    },
    {
        "id": 10,
        "title": "Kalpa Sutra",
        "category": "Chedasutra",
        "language": "Ardhamagadhi Prakrit",
        "author": "Acharya Bhadrabahu",
        "desc": "The most revered text read during the Paryushan festival, containing biographies of the Tirthankaras and rules for monks during the monsoon retreat.",
        "details": "The Kalpa Sutra has three main sections. The first, and most famous, details the lives of the 24 Tirthankaras, focusing heavily on Lord Mahavira, Parshvanatha, Neminatha, and Rishabhanatha. The second section lists the lineage (sthaviravali) of the prominent Acharyas after Mahavira. The third section outlines the specific rules (Samachari) that monks and nuns must follow during Chaturmas (the four-month rainy season retreat). Elaborately illuminated manuscripts of the Kalpa Sutra are prized in Jain art."
    },
    {
        "id": 11,
        "title": "Drishtivada",
        "category": "Anga Agama (Lost)",
        "language": "Ardhamagadhi Prakrit",
        "author": "Ganadhara Sudharmaswami",
        "desc": "The 12th Anga, which contained the 14 Purvas (ancient knowledge). It is considered lost to time, with only fragments surviving in later commentaries.",
        "details": "The Drishtivada was the most complex and vast of all the Angas. It contained the 14 Purvas, which were said to hold knowledge of all previous cosmic cycles, advanced mathematics, mystical powers (vidyas), and absolute refutations of all possible false doctrines. According to tradition, the ability to memorize and comprehend this vast knowledge declined over generations. Acharya Bhadrabahu was the last shruta-kevali (one who knew all 14 Purvas). After him, the knowledge gradually disappeared."
    }
]

with open("c:/Projects/learnaboutjainism.com/src/data/literature.json", "w", encoding="utf-8") as f:
    json.dump(literature_base, f, indent=2, ensure_ascii=False)

print("Successfully expanded literature.json!")
