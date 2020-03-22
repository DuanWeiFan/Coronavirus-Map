import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

class Web_scrapper():
    def __init__(self, duration = 10*60*60):
        self.coronavirus_data = None
        self.clock = None
        self.duration = duration

    def __get_data(self, url='https://www.newsbreak.com/topics/covid-19'):
        r = requests.get(url)
        # print('content:')
        # print(r.content)
        return r.status_code, BeautifulSoup(r.content, 'html.parser')

    def __scrape(self, soup):
        n_states = 50
        data = []
        for tr in soup.find('table', class_='state-table').find('tbody').find_all('tr', class_='grey-bg'):
            tds = tr.find_all('td')
            d = {
                'state': tds[0].find_all('span')[1].get_text(),
                'accumulate': tds[1].find('div').find(text=True, recursive=False),
                'new': 0,
                'death': tds[2].find('div').find(text=True, recursive=False)
                # 'cured': tds[3].find('div').find(text=True, recursive=False)
            }
            new_case = tds[1].find('div').find('div')
            if new_case:
                d['new'] = new_case.get_text().replace('+','')
            data.append(d)
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
