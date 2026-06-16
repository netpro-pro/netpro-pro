import ipaddress

def calcular_subred(ip_base: str, hosts_requeridos: int):
    try:
        red = ipaddress.IPv4Interface(ip_base)
        prefijo = 32 - (hosts_requeridos + 2).bit_length()
        nueva_subred = ipaddress.IPv4Network(f"{red.ip}/{prefijo}", strict=False)
        
        return {
            "red": str(nueva_subred.network_address),
            "mascara": str(nueva_subred.netmask),
            "primera_ip": str(nueva_subred.network_address + 1),
            "ultima_ip": str(nueva_subred.broadcast_address - 1),
            "broadcast": str(nueva_subred.broadcast_address),
            "prefijo": f"/{prefijo}"
        }
    except Exception as e:
        return {"error": str(e)}