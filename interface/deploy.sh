dfx stop

rm -rf .dfx/

dfx start --background

dfx canister create --all

npm install

dfx build

dfx canister install --all