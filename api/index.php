<?php
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

function connect_db() {
    $server = "127.8.162.130:3306";
    $user = 'admintWiKIdV';
    $pass = 'lmiblyzNKqe-';
    $database = 'sip';
    $connection = new mysqli($server, $user, $pass, $database);

    return $connection;
}


$app->hook('slim.before.dispatch', function() use ($app) { 
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->headers->set('Access-Control-Allow-Origin', '*');
        $app->response->headers->set('Access-Control-Allow-Methods: GET, POST');  
    });

$app->get(
    '/',
    function () {
        echo "Welcome to Communicate API Page";
    }
);

$app->post(
    '/friendlist',
    function () {
        $db = connect_db();
        $request = \Slim\Slim::getInstance()->request();
        $data = json_decode($request->getBody());
        
        $sip = $data->sip;

        $fl = $db->query("SELECT * FROM contact where sip = '$sip' ");
        $i = 0;
        while ($data = $fl->fetch_assoc()) {
            $message['friendlist'][$i] = $data;
            $i++;
        }
        $message['error'] = false;
        $message['message'] = "Friendlist found";

        echo json_encode($message);
    }
);

$app->post(
    '/add',
    function () {
        $db = connect_db();
        $request = \Slim\Slim::getInstance()->request();
        $data = json_decode($request->getBody());
        
        $mysip = $data->mysip;
        $sip = $data->sip;

        $cek = $db->query("SELECT * FROM contact WHERE sip='$mysip' AND contact_sip = '$sip' ");
        if ($cek->num_rows >= 1) {
            $message['message'] = "Duplicate Contact";
        }else{
            $kirim = $db->query("INSERT INTO contact(sip,contact_sip) VALUES('$mysip','$sip') ");
            if ($kirim) {
                $message['error'] = false;
                $message['message'] = "Contact Saved";
            }
        }

        echo json_encode($message);
    }
);

$app->post(
    '/chat/:rid',
    function ($rid) {
        $db = connect_db();
        $request = \Slim\Slim::getInstance()->request();
        $token = json_decode($request->getBody());
        
        $token1 = $token->token1;
        $token2 = $token->token2;

        if (authenticate($token1,$token2)) {
            $message['token'] = true;
            $message['error'] = false;
            $result = $db->query("SELECT * FROM user WHERE  `token1` = '$token1' AND `token2` = '$token2' ");
            $uid = $result->fetch_assoc()['id_user'];
            $chat = $db->query("SELECT * FROM chat where (id_sender='$uid' AND id_receiver='$rid') OR (id_sender='$rid' AND id_receiver='$uid') ORDER BY id_chat DESC ");
            $message['detail'] = $db->query("SELECT username,fullname,id_user FROM user WHERE id_user='$rid' ")->fetch_assoc();
            $i = 0;
            while ($data = $chat->fetch_assoc()) {
                $message['chat'][$i] = $data;
                if ($data['id_receiver'] == $uid) {
                    $message['chat'][$i]['left'] = true;
                }else{
                    $message['chat'][$i]['left'] = false;
                }
                $i++;
            }
        }else{
            $message['error'] = true;
            $message['token'] = false;
            $message['message'] = "Invalid Token, Please Re Login";
        }
        echo json_encode($message); 
    }
);


$app->run();