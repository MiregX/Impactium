import requests
import subprocess
import time
import psutil

def check_status():
    try:
        response = requests.get("https://impactium.fun/status", timeout=10)
        if response.status_code != 200:
            restart_node_server()
    except requests.exceptions.RequestException:
        restart_node_server()

def restart_node_server():
    print("Restarting Node.js server...")

    node_processes = [process for process in psutil.process_iter(['pid', 'name']) if 'node.exe' in process.info['name'].lower()]

    for process in node_processes:
        try:
            psutil.Process(process.info['pid']).terminate()
            psutil.Process(process.info['pid']).wait()  # Дожидаемся завершения процесса
        except (psutil.NoSuchProcess, psutil.TimeoutExpired):
            pass

    cmd_path = "C:\\Users\\Марк\\[КОД]\\Web\\Guild Menegment\\"
    subprocess.Popen(["node", "index.js"], cwd=cmd_path, shell=True)

if __name__ == "__main__":
    restart_node_server();
    while True:
        check_status()
        time.sleep(60)
