import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

class Web_scrapper():
    def __init__(self, duration = 10*60*60):
        self.coronavirus_data = None
        self.clock = None
        self.duration = duration

    def __get_data(self, url='https://www.dealmoon.com/guide/934164?utm_medium=social&s=android_copylink_share&utm_content=article_934164_867463032720718_867463032720718&utm_source=copylink&utm_campaign=android_copylink_share&x_from_site=cn'):
        r = requests.get(url)
        # print(r.content)
        return r.status_code, BeautifulSoup(r.content, 'html.parser')

    # def __get_states_mapping(self):
    #     r = requests.get('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json')
    #     return r.status_code, r.json()

    def __scrape(self, soup):
        n_states = 50
        data = []
        for tr in soup.findAll('table')[1].findAll('tr')[1:n_states+1]:
            tds = tr.findAll('td')
            data.append({
                'state': tds[0].get_text()[:2],
                'new': tds[1].get_text(),
                'accumulate': tds[2].get_text(),
                'death': tds[3].get_text(),
                'cured': tds[4].get_text()
            })
        return data

    def get_coronavirus_cases(self):
        if self.coronavirus_data and time.time() - self.clock <= self.duration:
            return self.coronavirus_data
        # _, states_mapping = self.__get_states_mapping()
        status_code, soup = self.__get_data()
        if status_code == 200:
            self.coronavirus_data = self.__scrape(soup)
            self.clock = time.time()
        return self.coronavirus_data

if __name__ == '__main__':
    scrapper = Web_scrapper()
    print(scrapper.get_coronavirus_cases())
