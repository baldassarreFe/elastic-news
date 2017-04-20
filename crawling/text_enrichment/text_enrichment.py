import os
from os.path import join, dirname

import watson_developer_cloud
import watson_developer_cloud.natural_language_understanding.features.v1 as features
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


class TextEnricher:
    def __init__(self):
        pass

    def enrichDocument(self, doc):
        if type(doc) is not dict:
            raise ValueError("doc should be a dict")

        full_text = doc['fullText']

        nlu = watson_developer_cloud.NaturalLanguageUnderstandingV1(
            version='2017-02-27',
            username=os.getenv("WATSON_USERNAME"),
            password=os.getenv("WATSON_PASSWORD"))

        response = nlu.analyze(
            text=full_text,
            features=[features.Entities(), features.Keywords()])

        doc["keywords"] = self._get_keywords(response)
        doc["entities"] = self._get_entities(response)

        return doc

    def _get_keywords(self, response):
        keywords = []
        if "keywords" in response:
            for keyword in response["keywords"]:
                keywords.append(keyword["text"])
        return keywords

    def _get_entities(self, response):
        entities = []
        if "entities" in response:
            for entity in response["entities"]:
                entities.append(entity["text"])
        return entities


def main():
    te = TextEnricher()
    orig_doc = {
        "fullText": 'this is my experimental text.  Bruce Banner is the Hulk and Bruce Wayne is BATMAN! Superman fears not Banner, but Wayne.'
    }
    annotated = te.enrichDocument(orig_doc)
    print(annotated)


if __name__ == "__main__":
    main()
