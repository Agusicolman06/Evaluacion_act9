<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "filmacion_4k";

// Validar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener y sanitizar datos del formulario
$nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_STRING);
$evento = filter_input(INPUT_POST, 'evento', FILTER_SANITIZE_STRING);
$fecha_evento = filter_input(INPUT_POST, 'fecha_evento', FILTER_SANITIZE_STRING);
$mensaje = filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING);

// Validaciones básicas
if (empty($nombre) || empty($email) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos obligatorios deben completarse']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'El email proporcionado no es válido']);
    exit;
}

try {
    // Conexión a la base de datos
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Insertar mensaje en la base de datos
    $stmt = $conn->prepare("INSERT INTO mensajes (nombre, email, telefono, evento, fecha_evento, mensaje) 
                           VALUES (:nombre, :email, :telefono, :evento, :fecha_evento, :mensaje)");
    
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':telefono', $telefono);
    $stmt->bindParam(':evento', $evento);
    $stmt->bindParam(':fecha_evento', $fecha_evento);
    $stmt->bindParam(':mensaje', $mensaje);
    
    $stmt->execute();
    
    // Registrar visita a la página de contacto
    $ip = $_SERVER['REMOTE_ADDR'];
    $pagina = 'contacto';
    $stmtVisita = $conn->prepare("INSERT INTO visitas (pagina, ip) VALUES (:pagina, :ip)");
    $stmtVisita->bindParam(':pagina', $pagina);
    $stmtVisita->bindParam(':ip', $ip);
    $stmtVisita->execute();
    
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado con éxito. Nos pondremos en contacto pronto.']);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al enviar el mensaje: ' . $e->getMessage()]);
}

$conn = null;
?>