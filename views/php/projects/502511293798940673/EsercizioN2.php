<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Concessionarie di automobili</title>
  <style>
table *{border: 1px solid black; padding: 3px;}</style>
</head>
<body>
    <?php
        // Elenco di concessionarie di automobili (array associativo)
        $concessionarie = array(
            "concessionaria1" => "Concessionaria Uno",
            "concessionaria2" => "Concessionaria Due",
            "concessionaria3" => "Concessionaria Tre"
        );

        // Elenco di automobili (array associativo)
        $automobili = array(
            array("marca" => "Fiat", "modello" => "Panda", "anno" => 2022),
            array("marca" => "Ford", "modello" => "Focus", "anno" => 2021),
            array("marca" => "Toyota", "modello" => "Corolla", "anno" => 2023)
        );

        // Elenco di veicoli a due ruote (array associativo)
        $dueRuote = array(
            array("marca" => "Honda", "modello" => "CBR1000RR", "anno" => 2020),
            array("marca" => "Ducati", "modello" => "Monster", "anno" => 2021),
            array("marca" => "Suzuki", "modello" => "GSX-R750", "anno" => 2019)
        );

        // Creazione del menu a tendina con le concessionarie di automobili
        echo '<label for="concessionarie">Seleziona una concessionaria:</label>';
        echo '<select id="concessionarie" name="concessionaria">';
        foreach ($concessionarie as $key => $value) {
            echo "<option value=\"$key\">$value</option>";
        }
        echo '</select>';

        // Visualizzazione delle automobili in una tabella
        echo '<h2>Automobili disponibili:</h2>';
        echo '<table border="1">';
        echo '<tr><th>Marca</th><th>Modello</th><th>Anno</th></tr>';
        foreach ($automobili as $auto) {
            echo '<tr>';
            foreach ($auto as $value) {
                echo "<td>$value</td>";
            }
            echo '</tr>';
        }
        echo '</table>';

        // Visualizzazione dei veicoli a due ruote in una tabella
        echo '<h2>Veicoli a due ruote disponibili:</h2>';
        echo '<table border="1">';
        echo '<tr><th>Marca</th><th>Modello</th><th>Anno</th></tr>';
        foreach ($dueRuote as $dueRuota) {
            echo '<tr>';
            foreach ($dueRuota as $value) {
                echo "<td>$value</td>";
            }
            echo '</tr>';
        }
        echo '</table>';
    ?>
</body>
</html>
