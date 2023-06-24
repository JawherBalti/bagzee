<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215160009 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE baggagite ADD object_type LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', ADD object_transport LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\'');
        $this->addSql('ALTER TABLE object_transport DROP FOREIGN KEY FK_25141EA9C1DE5FA4');
        $this->addSql('DROP INDEX IDX_25141EA9C1DE5FA4 ON object_transport');
        $this->addSql('ALTER TABLE object_transport DROP baggagite_id');
        $this->addSql('ALTER TABLE object_type DROP FOREIGN KEY FK_11CB6B3AC1DE5FA4');
        $this->addSql('DROP INDEX IDX_11CB6B3AC1DE5FA4 ON object_type');
        $this->addSql('ALTER TABLE object_type DROP baggagite_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE baggagite DROP object_type, DROP object_transport');
        $this->addSql('ALTER TABLE object_transport ADD baggagite_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_transport ADD CONSTRAINT FK_25141EA9C1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id)');
        $this->addSql('CREATE INDEX IDX_25141EA9C1DE5FA4 ON object_transport (baggagite_id)');
        $this->addSql('ALTER TABLE object_type ADD baggagite_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE object_type ADD CONSTRAINT FK_11CB6B3AC1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id)');
        $this->addSql('CREATE INDEX IDX_11CB6B3AC1DE5FA4 ON object_type (baggagite_id)');
    }
}
