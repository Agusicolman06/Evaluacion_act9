<?php
session_start();
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

// Obtener datos del formulario
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$password = $_POST['password'];

// Validaciones
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios']);
    exit;
}

try {
    // Conexión a la base de datos
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Buscar usuario en la base de datos
    $stmt = $conn->prepare("SELECT id, nombre, email, password FROM usuarios WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verificar contraseña
        if (password_verify($password, $user['password'])) {
            // Iniciar sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['logged_in'] = true;
            
            echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso', 'redirect' => 'admin/dashboard.php']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}

$conn = null;
?>