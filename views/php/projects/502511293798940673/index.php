<html>
<head>
    <title>Таблица с пользователями</title>
</head>
<body>
<style>
table * {
  padding: 3px;
  border: 1px solid black;
}
</style>
<table border="1">
    <tr>
        <th>Bмя</th>
        <th>Фамилия</th>
        <th>Улица</th>
        <th>Код (16 букв)</th>
        <th>Город</th>
    </tr>

    <?php

    $users = array(
        array("Анна", "Иванова", "Улица Пушкина, 123", "ABCD1234EFGH5678I", "Москва"),
        array("Павел", "Петров", "Улица Лермонтова, 456", "WXYZ9876QRST4321U", "Санкт-Петербург")
    );

    foreach ($users as $user) {
        echo "<tr>";
        echo "<td>" . $user[0] . "</td>";
        echo "<td>" . $user[1] . "</td>";
        echo "<td>" . $user[2] . "</td>";
        echo "<td>" . $user[3] . "</td>";
        echo "<td>" . $user[4] . "</td>";
        echo "</tr>";
    }
    ?>
</table>

</body>
</html>