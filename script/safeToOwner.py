# Created by blanker at 9/9/2022

# Feature
# Convert Gnosis Safe address to owner address
from web3 import Web3
import json
import time
import requests


if __name__ == '__main__':
    with open('../static/safe_user_allocations_reworked.csv', 'r') as file:
        airdrops = file.readlines()

    # Remove the file headers
    airdrops.pop(0)

    # Skip the scanned addresses
    address_to_skip = set()
    with open('../static/SafeOwners/success', 'r') as file:
        for line in file.readlines():
            address_to_skip.add(json.loads(line)['address']['value'])
    with open('../static/SafeOwners/errors', 'r') as file:
        for line in file.readlines():
            try:
                address_to_skip.add(json.loads(line)['arguments'][0])
            except Exception:
                continue

    for entry in airdrops:
        entry = entry.strip().split(',')
        entry[0] = Web3.toChecksumAddress(entry[0])

        if entry[0] in address_to_skip:
            continue

        # Obtain the Gnosis Safe detail for each vault
        print('Obtaining:', entry[0])
        response = requests.get(
            f'https://safe-client.gnosis.io/v1/chains/1/safes/{entry[0]}'
        )

        detail = response.json()
        if not detail.get('code'):
            # Normal response
            detail['airdropAmount'] = entry[1]

            # Overwrite the content into json file in every loop
            with open('../static/SafeOwners/success', 'a') as file:
                file.write(json.dumps(detail, ensure_ascii=True) + '\n')
        else:
            # Abnormal response, could contain mysterious safe address
            with open('../static/SafeOwners/errors', 'a') as file:
                file.write(json.dumps(detail, ensure_ascii=True) + '\n')
