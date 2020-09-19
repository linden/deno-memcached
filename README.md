# deno-memcached
memcached driver for deno

## Usage

```ts
import { Memcached } from "./mod.ts";

const client = new Memcached(11211, "127.0.0.1");

//set
await client.set("Hello", "world", 1800);

//get
const item = await client.get("Hello");

//update
await client.update("Hello", "there", 1800);

//delete
await client.delete("Hello");

//flush
await client.flush();
```