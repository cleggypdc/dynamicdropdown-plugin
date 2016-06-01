<?php

/**
 * Plugin
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md
 * file distributed with this source code.
 *
 * @category Pimcore
 * @copyright  Copyright (c) 2015 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de> & Paul Clegg <paul@gatherdigital.co.uk>
 * @license    http://www.pimcore.org/license    GNU General Public License version 3 (GPLv3)
 */

namespace DynamicdropdownPlugin;

use Pimcore\API;
use Pimcore\Loader\ClassMapAutoloader;

/**
 * Class \DynamicdropdownPlugin\Plugin
 */
class Plugin extends API\Plugin\AbstractPlugin implements API\Plugin\PluginInterface {


    public function init()
    {
        parent::init();

        //add backward compatibility for older classnames
        $classMapAutoloader = new ClassMapAutoloader(PIMCORE_PLUGINS_PATH . "/DynamicDropdown/autoload-classmap.php");
        $classMapAutoloader->register();
    }


    /**
     *  install function
     * @return string $message statusmessage to display in frontend
     */
    public static function install(){
        if(self::isInstalled()){
            $statusMessage = "installed";
        } else {
            $statusMessage = "not installed";
        }
        return $statusMessage;
    }

    /**
     * @return boolean
     */
    public static function needsReloadAfterInstall(){
        return true;
    }

    /**
     * indicates wether this plugins is currently installed
     * @return boolean
     */
    public static function isInstalled(){
        return true;
    }

    /**
     * uninstall function
     * @return string $messaget status message to display in frontend
     */
    public static function uninstall(){
        return "uninstall not necessary";
    }


    /**
     * @return string $jsClassName
     */
    public static function getJsClassName(){
        return ""; //pimcore.plugin.customerDb";
    }

    /**
     *
     * @param string $language
     * @return string path to the translation file relative to plugin direcory
     */
    public static function getTranslationFile($language) {
        if(file_exists(PIMCORE_PLUGINS_PATH . "/DynamicdropdownPlugin/texts/" . $language . ".csv")){
            return "/DynamicdropdownPlugin/texts/" . $language . ".csv";
        }
        return "/DynamicdropdownPlugin/texts/en.csv";
        
    }
}