import os

def replace_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    content = content.replace(' fill="transparent"', '')

    with open(file_path, 'w') as file:
        file.write(content)

def process_directory(directory):
    file_found = False
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith('.svg'):  # или другое расширение
                file_found = True
                print(f"Обрабатываю файл: {file_path}")
                replace_in_file(file_path)
    if not file_found:
        print("Не найдено файлов для обработки")

directory = 'C:/Users/markg/.adeline/Impactium/lib/icons/lib'  # Убедитесь, что путь правильный
process_directory(directory)
