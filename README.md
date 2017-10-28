# pastetangle
### An encrypted anonymous pastebin storing pastes in the tangle
This is a basic client side web application to show how [IOTA's Tangle](https://github.com/iotaledger) can be used to store data data easily, freely, securely! Please note that this project is a _proof of concept_ and can be used at your own risk.

[Demo - https://synestry.github.io/pastetangle](https://synestry.github.io/pastetangle)

### How it works
Each paste and corresponding editor settings are encrypted using the `aes-256-cbc` cypher and a randomly generated iota seed. The data is then attached to the tangle as a feeless transaction with the data as the message. The transaction bundle id is then returned to the application and stored as a querystring parameter along with the seed in the url to fetch the paste back from the tangle easily and decrypt it.

### Setup
As the project is completely client side with no backend depedenencies, setup is easy!
* Clone Repo
* `yarn install`
* `yarn start`

### Todo
- [x] Initial POC - [https://synestry.github.io/pastetangle](https://synestry.github.io/pastetangle)
- [ ] Choose iota node and seed
- [ ] Multiple files/pastes (like https://gist.github.com/)
- [ ] Friendlier UI and improvements
