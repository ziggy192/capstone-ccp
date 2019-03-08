package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.utils.PasswordAutoGenerator;
import com.ccp.webadmin.utils.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;

@Controller
@RequestMapping("staff")
public class AdminAccountController {

    private final AdminAccountService adminAccountService;


    @Autowired
    public AdminAccountController(AdminAccountService adminAccountService) {
        this.adminAccountService = adminAccountService;
    }

    @GetMapping({"", "/", "/index"})
    public String getStaff(Model model) {
        model.addAttribute("staffs", adminAccountService.findAll());
        return "staff/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("staff", adminAccountService.findById(id));
        return "staff/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("staff", new AdminAccountEntity());
        return "staff/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("staff") AdminAccountEntity adminAccountEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            if (adminAccountEntity.getId() != null) {
                return "staff/detail";
            } else
                return "staff/create";

        }


        adminAccountService.save(adminAccountEntity);
        Integer id = adminAccountEntity.getId();
        return "redirect:detail/" + id;
    }
}
