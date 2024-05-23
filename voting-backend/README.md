# Voting Contract

1. create a near account
 - near create-account voterntupm.testnet --useFaucet
2. build the contract
  - npm run build
3. deploy the contract
  - near deploy voterntupm.testnet ./build/hello_near.wasm
4. test the contract
  - near view voterntupm.testnet getAllPrompts


# Frontend
1. install dependencies
  - npm install
2. set env
  - create a `.env` file in the root directory, and add the following line
  - `CONTRACT_NAME=voterntupm.testnet`
3. run the frontend
  - parcel index.html --open

## TODO
- [] admin and user access
- [] fix UI display
- [] loading spinner on blocking operations


# misc

### for the test account
existing deployment: https://testnet.nearblocks.io/txns/H4zzZwLBBi9PXPJFt4XXmyUQTmwocS2gCwkxkvcSi27S
ID: voterntupm.testnet
verify foot apple consider rug wink second course wear rare broom digital
