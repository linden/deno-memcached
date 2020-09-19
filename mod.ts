export class Memcached {
    port: number;
    hostname: string;
    max: number;

    constructor(port: number, hostname: string, max?: number) {
        this.port = port;
        this.hostname = hostname;
        this.max = max || 2048;
    }

    private async request(body: string): Promise<string> {
        const connection = await Deno.connect({ hostname: this.hostname, port: this.port });
        const buffer = new Uint8Array(this.max);

        await connection.write(new TextEncoder().encode(body));
        await connection.read(buffer);

        connection.close();

        return Promise.resolve(new TextDecoder().decode(buffer));
    }
    
    async get(key: string): Promise<string|null> {
        const response = await this.request(`get ${key}\r\n`);

        if(response.indexOf("END") != 0 && response.includes("VALUE")) {
            return response.slice(response.indexOf("\r\n") + "\r\n".length, response.indexOf("\r\nEND"));
        } else {
            return null;
        }
    }
    
    async set(key: string, value: string, lifetime: number) {
        await this.request(`set ${key} 0 ${lifetime} ${value.length}\r\n${value}\r\n`);
    }

    async replace(key: string, value: string, lifetime: number) {
        await this.request(`replace ${key} 0 ${lifetime} ${value.length}\r\n${value}\r\n`);
    }
    
    async delete(key: string) {
        await this.request(`delete ${key}\r\n`);
    }

    async flush() {
        await this.request("flush_all\r\n");
    }
}

