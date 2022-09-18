# Created by blanker at 12/9/2022

# Feature
# Enter feature description here
import os
from github3 import login
from dotenv import load_dotenv


load_dotenv()


def github_release(owner: str, repo: str, tag_name: str, files: tuple):
    # GitHub connection
    github = login(token=os.getenv('GITHUB_TOKEN'))
    github.session.default_read_timeout = 20
    github.session.default_connect_timeout = 20

    repository = github.repository(owner=owner, repository=repo)
    release = repository.create_release(
        tag_name=tag_name
    )
    for file in files:
        print('Uploading: ' + file.split('/')[-1])
        release.upload_asset(
            content_type='application/text',
            name=file.split('/')[-1],
            asset=open(
                file=os.path.join(
                    os.path.split(os.path.realpath(__file__))[0], file
                ),
                mode='rb'
            )
        )


if __name__ == '__main__':
    github_release(
        owner='BlankerL', repo='GnosisSafeFarmerFilter',
        tag_name='transaction-history',
        files=('../static/transaction_histories', )
    )
