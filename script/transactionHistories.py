# Created by blanker at 9/9/2022

# Feature
# Scrape all transaction histories for saves
from web3 import Web3
import time
import json
import requests


def format_result(results) -> list:
    formatted_result = list()
    for entry in results:
        if entry['type'] == 'TRANSACTION':
            formatted_result.append(entry)
        elif entry['type'] == 'DATE_LABEL':
            pass
        else:
            print(f"Unrecognized type: {entry['type']}")
    return formatted_result


if __name__ == '__main__':
    with open('../static/safe_user_allocations_reworked.csv', 'r') as file:
        airdrops = file.readlines()

    # Remove the file headers
    airdrops.pop(0)

    address_to_skip = set()
    with open('../static/transaction_histories', 'r') as file:
        for line in file.readlines():
            address_to_skip.add(list(json.loads(line).keys())[0])

    # For each Gnosis Save vault
    for entry in airdrops:
        # Get the vault address
        entry = entry.strip().split(',')
        entry[0] = Web3.toChecksumAddress(entry[0])

        # Skip this entry if the address is already looked up
        if entry[0] in address_to_skip:
            continue

        print('Obtaining:', entry[0])
        # Initialize the address-histories dictionary
        address_history = dict()
        address_history[entry[0]] = list()

        response = requests.get(
            url=f'https://safe-client.gnosis.io/v1/chains/1/safes/{entry[0]}/transactions/history'
        )

        page_count = 1
        while True:
            # Parse the response and append the return documents into the dict
            response = response.json()

            if response.get('results'):
                address_history[entry[0]] += format_result(response['results'])

                # Pagination and use the above codes to parse
                if response['next']:
                    response = requests.get(
                        url=response['next']
                    )
                    # Only track 20 pages for each safe
                    page_count += 1
                    if page_count % 20 == 0:
                        break
                else:
                    # Loop until there is no 'next' page
                    break
            else:
                break

            time.sleep(0.02)

        with open('../static/transaction_histories.txt', 'a') as file:
            file.write(json.dumps(address_history, ensure_ascii=True) + '\n')
