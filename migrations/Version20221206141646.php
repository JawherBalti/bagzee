<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221206141646 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE popup_pub_front (id INT AUTO_INCREMENT NOT NULL, ville_id INT DEFAULT NULL, start DATE NOT NULL, end DATE NOT NULL, photo VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_76DDC9E6A73F0036 (ville_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE popup_pub_front ADD CONSTRAINT FK_76DDC9E6A73F0036 FOREIGN KEY (ville_id) REFERENCES ville (id)');
        $this->addSql('ALTER TABLE ville_publicity DROP FOREIGN KEY FK_EE42DE9BA73F0036');
        $this->addSql('DROP TABLE ville_publicity');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ville_publicity (id INT AUTO_INCREMENT NOT NULL, ville_id INT DEFAULT NULL, start DATE NOT NULL, end DATE NOT NULL, photo VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_EE42DE9BA73F0036 (ville_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE ville_publicity ADD CONSTRAINT FK_EE42DE9BA73F0036 FOREIGN KEY (ville_id) REFERENCES ville (id)');
        $this->addSql('ALTER TABLE popup_pub_front DROP FOREIGN KEY FK_76DDC9E6A73F0036');
        $this->addSql('DROP TABLE popup_pub_front');
    }
}
