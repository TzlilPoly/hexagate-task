import json
from api.schema import FundGraphEdge,FundGraphResponse


class DataService:
    def get_data(self):
        json_file = open('data.json')
        data = json.load(json_file)

        return data