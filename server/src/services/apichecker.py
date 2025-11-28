import asyncio
from metaapi_cloud_sdk import MetaApi

async def test_metaapi():
    api = MetaApi('YOUR_API_TOKEN')
    
    # Add your MT5 account
    # (You can use a demo account from any broker)
    account = await api.metatrader_account_api.get_account('account_id')
    
    # Connect
    connection = await account.connect()
    
    # Wait for connection
    await connection.wait_synchronized()
    
    # Get account info
    account_info = await connection.get_account_information()
    print(f"Balance: {account_info['balance']}")
    
    # Get positions
    positions = await connection.get_positions()
    print(f"Open positions: {len(positions)}")

asyncio.run(test_metaapi())