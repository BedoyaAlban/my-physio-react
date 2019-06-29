<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Migrations\Version\Factory;
use Faker\Factory as FakerFactory;
use App\Entity\Clients;
use App\Entity\Invoice;
use App\Entity\User;
use ProxyManager\ProxyGenerator\ValueHolder\MethodGenerator\Constructor;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\Diary;

class AppFixtures extends Fixture
{
    /**
     * L'encodeur de mots de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = FakerFactory::create('fr_FR');

        for($u = 0; $u < 10; $u++) {
            $user = new User();

            $chrono = 1;

            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($hash);
            
            $manager->persist($user);

            for($c = 0; $c < mt_rand(5, 20); $c++) {
                $clients = new Clients();
                $clients->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setAdressNumber($faker->randomDigit)
                    ->setAdressName($faker->streetName)
                    ->setAdressCity($faker->city)
                    ->setZipCode($faker->postcode)
                    ->setEmail($faker->email)
                    ->setNumberPhone($faker->phoneNumber)
                    ->setSecuritySocialNumber($faker->numberBetween($min = 10000, $max = 19000))
                    ->setNote($faker->paragraph)
                    ->setUser($user);

                $manager->persist($clients);

                for($d = 0; $d < mt_rand(2, 10); $d++) {
                    $diary = new Diary();
                    $diary->setDate($faker->dateTimeAD($max = 'now', $timezone = null))
                        ->setStartSession($faker->dateTimeBetween('-1 years' , 'now', $timezone = null))
                        ->setEndSession($faker->dateTime($max = 'now', $timezone = null))
                        ->setClients($clients)
                        ->setUsers($user);
                    
                    $manager->persist($diary);

                }
    
                for($i = 0; $i < mt_rand(2, 5); $i++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 1000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['INVOICED', 'PAID', 'CANCELLED']))
                        ->setClient($clients)
                        ->setChrono($chrono);
    
                    $chrono++;        
    
                    $manager->persist($invoice);
                }
            }
        }
        
        $manager->flush();
    }
}
