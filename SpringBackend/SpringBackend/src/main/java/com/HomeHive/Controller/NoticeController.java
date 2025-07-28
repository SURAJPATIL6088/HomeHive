package com.HomeHive.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.custom_error.NoticeError;
import com.HomeHive.dto.CreateNoticeDTO;
import com.HomeHive.dto.NoticeResponseDTO;
import com.HomeHive.entities.Notice;
import com.HomeHive.service.NoticeService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/notices")
@AllArgsConstructor
public class NoticeController {
	
	private final NoticeService noticeService;
	
	@GetMapping("/getActive")
	public ResponseEntity<List<Notice>> getAllActiveNtices(){
		List<Notice>notices = noticeService.getActiveNotices();
		return ResponseEntity.ok(notices);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/getAll")
	public ResponseEntity<List<Notice>> getAllNtices(){
		List<Notice>notices = noticeService.getAllNotices();
		return ResponseEntity.ok(notices);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/post-notice")
	public ResponseEntity<?> createNotice(@RequestBody @Valid CreateNoticeDTO dto){
		NoticeResponseDTO createdNotice = noticeService.createNotice(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdNotice);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/update-notice/{noticeId}")
	public ResponseEntity<?> updateNotice(@PathVariable Long noticeId, @RequestBody CreateNoticeDTO dto){
		NoticeResponseDTO updatedNotice = noticeService.updateNotice(noticeId, dto);
		return ResponseEntity.status(HttpStatus.OK).body(updatedNotice);
	}
	
	@DeleteMapping("/remove/{noticeId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteNotice(@PathVariable Long noticeId){
		noticeService.deleteNotice(noticeId);
		
		return ResponseEntity.ok(NoticeError.DELETE_NOTICE.getMsg());
	}
}
