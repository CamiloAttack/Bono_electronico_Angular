
<?php  


$totalMontoComprobante = $_POST['totalMontoComprobante'];
$datosBonificacionTotales = $_POST['datosBonificacionTotales'];
$datosCopagoTotales = $_POST['datosCopagoTotales'];

$datosBonificacionTotales = $_POST['datosBonificacionTotales'];
$totalExedenteComprobante = $_POST['totalExedenteComprobante'];
$datosFolio = $_POST['datosFolio'];

$datosTitular = $_POST['datosTitular'];
$datosBeneficiario = $_POST['datosBeneficiario'];
$datosUsuario = $_POST['datosUsuario'];


//variables 
$razonSocialRut = $_POST['razonSocialRut'];
$fecha_unix = gmdate("d-m-Y H:i:s",$_POST['fecha_atencion_unix']);
$tipoAtencion = ($_POST['tipoAtencion']=="ONLINE") ? "BONIFICADA" : "PARTICULAR";
$plan = $_POST['plan'];

$razonSocialRut = explode("-",$razonSocialRut);
$razonSocialRut = number_format($razonSocialRut[0], 0, '', '.')."-".$razonSocialRut[1]; 

$datosTitularRut = explode("-",$datosTitular['rut']);
$datosTitularRut = number_format($datosTitularRut[0], 0, '', '.')."-".$datosTitularRut[1]; 


$datosBeneficiarioRut = explode("-",$datosBeneficiario['rut']);
$datosBeneficiarioRut = number_format($datosBeneficiarioRut[0], 0, '', '.')."-".$datosBeneficiarioRut[1];


$datosUsuariorazonSocialRut = explode("-",$datosUsuario['razonSocialRut']);
$datosUsuariorazonSocialRut = number_format($datosUsuariorazonSocialRut[0], 0, '', '.')."-".$datosUsuariorazonSocialRut[1];
 

foreach ($_POST['prestaciones'] as $key => $value) {


      $html.= "<div style='  font-size: 10px;font-size: 10px; margin: 0px; padding: 0px;padding-top: 0px;font-family: Helvetica,Arial,sans-serif; line-height: 1.42857143; color: #333;clear: both; border:red solid 0px;height:450px';float:left>";
        $html.="<div  style='padding: 5px;border:1px #999999 solid; background: #FFFFFF;margin: 0px; margin-bottom: 10px; border-radius: 5px;height:15px'>";
                   $html.="<div style='float:left;width: 33%;'> RUT: ".$razonSocialRut."</div>";
                   $html.="<div style='text-align: center;float:left;width:33%;'>COMPROBANTE DE ATENCION</div>";
                   $html.="<div style='float:left;width: 33%;text-align:right'>Nro. Atención ".$datosFolio[$key]."</div>";
                $html.="</div>";
                $html.="<div  style='border: 1px #999999 solid; background: #FFFFFF; margin: 0px; margin-bottom: 10px;  border-radius: 5px; height:52px;padding:5px;'>";
                   $html.="<div style='border-right: 1px #999999 solid;padding: 0px;height: 50px;width: 50%; float: left;'>";
                      $html.="<div >Fecha y Hora de Emisión: ".$fecha_unix."</div>";
                      $html.="<div >Titular : ".$datosTitular['nombre']." ".$datosTitular['apellidoPaterno']." ".$datosTitular['apellidoMaterno']."  RUT: ".$datosTitularRut."</div>";
                      $html.="<div >Beneficiario : ".$datosBeneficiario['nombre']." ".$datosBeneficiario['apellidoPaterno']." ".$datosBeneficiario['apellidoMaterno']."  RUT: ".$datosBeneficiarioRut."</div>";
                  $html.= "</div>";
                   $html.="<div style='padding-left: 5px;height: 100%;float: left;'>";
                      $html.="<div class=''>Emisor : ".$datosUsuario['lugarAtencionNombre']."  RUT : ".$datosUsuariorazonSocialRut."</div>";
                      $html.="<div class=''>Tipo de Atención : ".$tipoAtencion ."  </div>";
                      $html.="<div class=''>Plan/Grupo de Ingreso : ".$plan."</div>";
                  $html.="</div>";
                $html.="</div>";
                $html.="<div style='border: 1px #999999 solid; background: #FFFFFF; margin: 0px; margin-bottom: 10px; border-radius: 5px; padding-right:15px;padding-left: 15px;'>";
                   $html.="<table style='width: 100%; max-width: 100%;border-spacing: 0; border-collapse: collapse; text-align:center; font-size:10px;color:#333 '>";
                      $html.="<thead>";
                         $html.="<tr >";
                            $html.="<td style='border-right: 1px #999999 solid;padding: 0px;height: 35px;text-align: center;width: 50%;'>DETALLE DE PRESTACION</td>";
                           $html.=" <td style='border-right: 1px #999999 solid;padding: 0px;height:35px;text-align: center;'>VALOR</td>";
                            $html.="<td style='border-right: 1px #999999 solid;padding: 0px;height: 35px; text-align: center;'>BONIFICACIONES</td>";
                            $html.="<td style='border-right: 0px #999999 solid;padding: 0px;height: 35px;text-align: center;'>TOTAL COPAGO</td>";
                         $html.="</tr>";
                      $html.="</thead>";
                      $html.="<tbody>";

                    foreach ($value as $k => $v) {

                      $codigoMedico = $v['codigoMedico'];
                      $nombreMedico = $v['nombreMedico'];
                      $codigoEspecialidad = $v['codigoEspecialidad'];
                      $nombreEspecialidad = $v['nombreEspecialidad'];

                      $html.="<tr >";
                        $html.="<td style='border-top: 0px solid #ddd;width:50% ;border-right:1px #999999 solid'>".$v['codigo']." - ".$v['nombre']." </td>";
                        $html.="<td style='border-top: 0px solid #ddd;width:16% ;border-right:1px #999999 solid;text-align:right;padding-right:5px;'>".$v['valorPrestacion']."</td>";
                        $html.="<td style='border-top: 0px solid #ddd;width:17% ;border-right:1px #999999 solid;text-align:right;padding-right:5px;'>".$v['aporteFinanciador']."</td>";
                        $html.="<td style='border-top: 0px solid #ddd;width:17% ;border-right:0px #999999 solid;text-align:right;padding-right:5px;'>".$v['copago']."</td>";
                      $html.="</tr>";  

                    } 

                      $html.="</tbody>";                       
                      $html.="<tfoot>";
                      $html.="<tr >";
                        $html.="<td style='text-align:right;padding:5px'>TOTALES</td>";
                        $html.="<td style='text-align:right;padding:5px'>".$totalMontoComprobante[$key]."</td>";
                        $html.="<td style='text-align:right;padding:5px'>".$datosBonificacionTotales[$key]."</td>";
                        $html.="<td style='text-align:right;padding:5px'>".$datosCopagoTotales[$key]."</td>";
                      $html.="</tr>";

                      $html.="</tfoot>";
                   $html.="</table>";
                $html.="</div>";


                $html.="<div style='border: 1px #999999 solid; background: #FFFFFF; margin: 0px; margin-bottom: 10px; border-radius: 5px; padding-right:0px;padding-left: 0px;height:50px; margin-top:0px'>";
                  $html.="<table style='width: 100%; max-width: 100%;border-spacing: 0; border-collapse: collapse; text-align:center; font-size:10px;color:#333;height:50px '>";
                     $html.="<tbody>";
                        $html.="<tr>";
                           $html.="<td  style='padding: 0px;  text-align: center; width: 100%; height: 20px;border: 0px black solid;'>";
               
                            $html.=" <div style='background: #FFFFFF; margin: 0px; border-radius: 5px; height:16px;padding-top:4px'>";
                               $html.="<div  style='border-bottom: 1px #999999 solid;text-align:center;height: 16px;width: 100%;float: right;'>";
                                  $html.="DETALLE DE BONIFICACIONES";
                               $html.="</div>";
                            $html.="</div>";
                                
                           $html.="</td>";
                        $html.="</tr>";

                        $html.="<tr >";
                           $html.="<td  style='padding: 0px;  text-align: center; width: 100%; height: 20px;border: 0px black solid;'>";
         
                               $html.="<table style='width: 100%; max-width: 100%;border-spacing: 0; border-collapse: collapse; text-align:center; font-size:10px;color:#333 '>";
                               $html.="<tbody>";
                                  $html.="<tr>";
                                     $html.="<td style='border-top: 0px solid #ddd;width:24% ;border-right:1px #999999 solid;text-align:center;height:29px'>ISAPRE : ".$datosBonificacionTotales[$key]." </td>";
                                     $html.="<td style='border-top: 0px solid #ddd;width:24% ;border-right:1px #999999 solid;text-align:right;padding-right:5px;text-align:center;'>COMPAÑIA DE SEGURO : $0.00</td>";
                                     $html.="<td style='border-top: 0px solid #ddd;width:24% ;border-right:1px #999999 solid;text-align:right;padding-right:5px;text-align:center;'>CCAF :  $0.00</td>";
                                     $html.="<td style='border-top: 0px solid #ddd;width:24% ;border-right:0px #999999 solid;text-align:right;padding-right:5px;text-align:center;'>EXCEDENTE : ".$totalExedenteComprobante[$key]."</td>";
                                  $html.="</tr>";
                               $html.="</tbody>";
                              $html.="</table>";                
                               
                           $html.="</td>";
                        $html.="</tr>";
                     $html.="</tbody>";
                 $html.=" </table>";
               $html.=" </div>";


                $html.="<div style='border: 1px #999999 solid; background: #FFFFFF; margin: 0px; margin-bottom: 0px; border-radius: 5px; padding-right:0px;padding-left: 0px;height:100px; margin-top:0px'>";
                  $html.="<table style='width: 100%; max-width: 100%;border-spacing: 0; border-collapse: collapse; text-align:center; font-size:10px;color:#333;height:0px '>";
                     $html.="<tbody>";
                        $html.="<tr>";
                           $html.="<td style='padding: 0px; height: 35px; text-align: center; width: 33%; height: 0px; ;border-right: 1px #999999 solid;'>";
                              $html.="<div style='float: left;  height: 90px; width: 100%; '>";
                                 $html.="<div style=' font-size: 9px;padding: 2px;text-align:center;'>PROFESIONAL/INSTITUCION :</div>";
                                 $html.="<div style='border-bottom: 1px #999999 solid;text-align:center;'>".$datosUsuario['nombreRazonSocialSucursal']." ".$datosUsuarioRut."</div>";
                                $html.="<div style='font-size: 9px; padding: 2px;text-align:center;'>MEDICO TRATANTE :</div>";
                                 $html.="<div style='border-bottom: 1px #999999 solid;text-align:center;'>".$codigoMedico."- ".$nombreMedico."</div>";
                                 $html.="<div style='font-size: 9px; padding: 2px;text-align:center;'>ESPECIALIDAD :</div>";
                                 $html.="<div style='text-align:center'>".$codigoEspecialidad." -".$nombreEspecialidad."</div>";
                              $html.="</div>";
                           $html.="</td>";
                           $html.="<td style='border-right: 1px #999999 solid;padding: 0px;height: 98px; text-align: center;border-right: 1px #999999 solid;'>";
                   
      
                            $html.="<div style='width: 100%;float:left; text-align:center;padding-top:50px'>";
                                $html.="<div style='margin-left: 20px;margin-right: 20px; margin-top: 0px; border-bottom: 1px #000000 solid;'></div>";
                                $html.="<div style='text-align:center; font-size: 9px; padding: 2px;margin-left: 20px;margin-right: 20px;'>FIRMA DEL PROFESIONAL</div>";
                            $html.="</div>";
             
                           $html.="</td>";

                           $html.="<td style='solid;padding: 0px;height: 98px; text-align: center;'>";
                            $html.="<div style='width: 100%;float:left; text-align:center;padding-top:50px'>";
                                $html.="<div style='margin-left: 20px;margin-right: 20px; margin-top: 0px; border-bottom: 1px #000000 solid;'></div>";
                                $html.="<div style='text-align:center; font-size: 9px; padding: 2px;margin-left: 20px;margin-right: 20px;'>FIRMA DEL BENEFICIARIO</div>";
                            $html.="</div>";
                               
                           $html.="</td>";
                        $html.="</tr>";
                     $html.="</tbody>";
                 $html.=" </table>";
               $html.=" </div>";

 

            $html.="</div>";

            $html.="<br><br>";  
   
 }



require_once 'dompdf/autoload.inc.php';
use Dompdf\Dompdf;


$html.="<table border='1'><tr><td>aca puedes probar con una img </td></tr></table>";

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->set_paper(array(0, 0, 595, 841), 'portrait');
$dompdf->render(); // Generar el PDF desde contenido HTML
$pdf = $dompdf->output(); // Obtener el PDF generado
//$dompdf->stream(); // Enviar el PDF generado al navegador
 
file_put_contents("pdfs/bono.pdf", $pdf);//convertir a archivo dejando en ruta

require("class.phpmailer.php");
require("class.smtp.php");

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth = true;
$mail->SMTPSecure = "ssl";
$mail->Host = "smtp.gmail.com";
$mail->Port = 465;
$mail->Username = "xxxx@gmail.com";
$mail->Password = "xxxxxxx123";

$mail->From = "xxxx@gmail.com";
$mail->FromName = "Titulo";
$mail->Subject = "Mensaje de empresa xxxxx";
$mail->AltBody = "";
$mail->MsgHTML($html);
$mail->AddAttachment("pdfs/bono.pdf");// adjunto archivo recién creado 
$mail->AddAddress("xxxxxx@xxxx.cl", "Nombre Destinatario");

$mail->CharSet = 'UTF-8';
$mail->IsHTML(true);
$mail->Send();



return "OK";






        ?>
 